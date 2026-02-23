import axios from 'axios';
import { API_CONFIG, isDevelopment, ENCRYPTION_KEY_STORAGE, CACHE_PREFIX, CACHE_TTL, shouldUseCredentials } from './constants';
import { getOpenApiFormHeaders, getFormHeaders, getJsonHeaders, getJsonHeadersMinimal, getTokenJsonHeaders, getAGFHeaders } from './headers';
import { urls } from './urls';
import type {
  AuthTokenData, WithdrawalResult, Proposal, ProposalListResponse,
  LinkConnection, ConsensusConnection, IncomeRecord, WithdrawalRecord, JoinATMFormData,
  GameProposal, Game, GameRating, GameInvestment, BattleData, UpdateBattleData,
  UserStarsData, ApiResponse, CoinCurrency, TokenInfo, TokenApproval, ContractSection,
  RecoveryTransaction, AGFGameProposal, AGFProposalResponse, CrosschainTransferResult,
} from './types';

// ─────────────────────────────────────────────────────────────────────────────
// EncryptionService
// ─────────────────────────────────────────────────────────────────────────────
export class EncryptionService {
  private async getOrCreateKey(): Promise<CryptoKey> {
    const stored = localStorage.getItem(ENCRYPTION_KEY_STORAGE);

    if (stored) {
      const keyData = JSON.parse(stored);
      return await crypto.subtle.importKey('jwk', keyData, { name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
    }

    const key = await crypto.subtle.generateKey({ name: 'AES-GCM', length: 256 }, true, ['encrypt', 'decrypt']);
    const exported = await crypto.subtle.exportKey('jwk', key);
    localStorage.setItem(ENCRYPTION_KEY_STORAGE, JSON.stringify(exported));
    return key;
  }

  async encryptData(data: any): Promise<string> {
    const key = await this.getOrCreateKey();
    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encoded = new TextEncoder().encode(JSON.stringify(data));
    const encrypted = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, key, encoded);
    const combined = new Uint8Array(iv.length + encrypted.byteLength);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);
    return btoa(String.fromCharCode(...combined));
  }

  async decryptData(encrypted: string): Promise<any> {
    const key = await this.getOrCreateKey();
    const combined = Uint8Array.from(atob(encrypted), c => c.charCodeAt(0));
    const iv = combined.slice(0, 12);
    const data = combined.slice(12);
    const decrypted = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, key, data);
    return JSON.parse(new TextDecoder().decode(decrypted));
  }

  async setCache(key: string, data: any, ttl: number = CACHE_TTL): Promise<void> {
    const encrypted = await this.encryptData(data);
    localStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify({ data: encrypted, timestamp: Date.now(), ttl }));
  }

  async getCache(key: string): Promise<any | null> {
    const stored = localStorage.getItem(`${CACHE_PREFIX}${key}`);
    if (!stored) return null;
    const cacheData = JSON.parse(stored);
    if (Date.now() - cacheData.timestamp > cacheData.ttl) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
      return null;
    }
    return await this.decryptData(cacheData.data);
  }

  clearCache(key?: string): void {
    if (key) {
      localStorage.removeItem(`${CACHE_PREFIX}${key}`);
    } else {
      Object.keys(localStorage).filter(k => k.startsWith(CACHE_PREFIX)).forEach(k => localStorage.removeItem(k));
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AuthenticationService
// ─────────────────────────────────────────────────────────────────────────────
export class AuthenticationService {
  private userAddress: string | null = null;
  private loginToken: string | null = null;
  private tokenExpiry: number | null = null;
  private cookie: string | null = null;
  private authPromise: Promise<string> | null = null;

  constructor() {
    this.loadFromStorage();
  }

  private loadFromStorage() {
    const token = localStorage.getItem('atm_token');
    const expiry = localStorage.getItem('atm_token_expiry');
    const address = localStorage.getItem('atm_address');
    const cookie = localStorage.getItem('atm_cookie');

    if (token && expiry && address && Date.now() < parseInt(expiry)) {
      this.loginToken = token;
      this.tokenExpiry = parseInt(expiry);
      this.userAddress = address;
      this.cookie = cookie;
    } else {
      this.clearAuth();
    }
  }

  setUserAddress(address: string) {
    const normalizedAddress = address?.toLowerCase();
    if (this.userAddress && this.userAddress !== normalizedAddress) {
      this.clearAuth();
    }
    this.userAddress = normalizedAddress;
    if (normalizedAddress) {
      localStorage.setItem('atm_address', normalizedAddress);
    }
  }

  getUserAddress(): string | null {
    return this.userAddress;
  }

  isAuthenticated(): boolean {
    return this.isTokenValid() && !!this.userAddress;
  }

  clearAuth() {
    this.loginToken = null;
    this.tokenExpiry = null;
    this.userAddress = null;
    this.cookie = null;
    this.authPromise = null;
    localStorage.removeItem('atm_token');
    localStorage.removeItem('atm_token_expiry');
    localStorage.removeItem('atm_address');
    localStorage.removeItem('atm_cookie');
  }

  isTokenValid(): boolean {
    return !!(this.loginToken && this.tokenExpiry && Date.now() < this.tokenExpiry);
  }

  async getSignMessage(): Promise<string> {
    if (!this.userAddress) throw new Error('User address not set');

    const response = await axios.get(urls.open.getSignMessage, {
      headers: getOpenApiFormHeaders(),
      params: { address: this.userAddress },
    });

    const signMessage = response.data?.data?.signMessage || response.data?.signMessage || response.data?.data;
    if (!signMessage || typeof signMessage !== 'string') {
      throw new Error('Invalid sign message response');
    }
    return signMessage;
  }


  /**
   * ERC-6492 magic suffix (32 bytes). If a signature ends with this,
   * it is a smart-account wrapped signature that needs unwrapping
   * before the ATM server can verify it with standard ecrecover.
   */
  private static readonly ERC6492_MAGIC = '6492649264926492649264926492649264926492649264926492649264926492';

  /**
   * Detect & unwrap an ERC-6492 wrapped signature.
   * Format: abi.encode(address factory, bytes calldata, bytes innerSig) ++ magicBytes
   * We extract the inner 65-byte ECDSA signature from the third ABI-encoded field.
   */
  private unwrapERC6492(signature: string): string {
    const raw = signature.startsWith('0x') ? signature.slice(2) : signature;

    // Check for magic suffix (last 64 hex chars = 32 bytes)
    if (raw.length <= 64 || !raw.endsWith(AuthenticationService.ERC6492_MAGIC)) {
      return signature; // Not ERC-6492, return as-is
    }

    console.log('[Auth] Detected ERC-6492 wrapped signature, unwrapping...');

    try {
      // Strip the 32-byte magic suffix
      const abiEncoded = raw.slice(0, raw.length - 64);

      // ABI-encoded (address, bytes, bytes):
      // - Word 0 (0-64):   address factory (left-padded to 32 bytes)
      // - Word 1 (64-128):  offset to factoryCalldata bytes
      // - Word 2 (128-192): offset to inner signature bytes
      // Read offset to third parameter (inner signature)
      const sigOffset = parseInt(abiEncoded.slice(128, 192), 16) * 2; // convert byte offset to hex char offset

      // At the offset: first 32 bytes = length of the inner signature
      const sigLength = parseInt(abiEncoded.slice(sigOffset, sigOffset + 64), 16) * 2; // in hex chars

      // Read the inner signature data
      const innerSig = abiEncoded.slice(sigOffset + 64, sigOffset + 64 + sigLength);

      // Standard ECDSA signature is 65 bytes = 130 hex chars
      if (innerSig.length === 130) {
        const unwrapped = '0x' + innerSig;
        console.log('[Auth] Successfully unwrapped ERC-6492 → standard 65-byte ECDSA signature');
        return unwrapped;
      }

      // If inner sig is not 65 bytes, it might be ERC-1271 or nested —
      // try using it anyway, log a warning
      console.warn(`[Auth] Inner signature is ${innerSig.length / 2} bytes (expected 65). Using it as-is.`);
      return '0x' + innerSig;
    } catch (error) {
      console.error('[Auth] Failed to unwrap ERC-6492 signature:', error);
      return signature; // Return original on error
    }
  }

  async signMessage(message: string, walletProvider: any, messageSigner?: (args: { message: string }) => Promise<string>): Promise<string> {
    if (!this.userAddress) throw new Error('User address not set');

    let signature: string;

    try {
      // Use wagmi's signMessageAsync when available — it handles encoding
      // correctly for both injected wallets (MetaMask) and Reown embedded
      // wallets (Google/social auth via viem). wagmi internally uses
      // stringToHex which both wallet types interpret identically.
      if (messageSigner) {
        signature = await messageSigner({ message });
      } else {
        // Fallback: direct provider.request for injected wallets (MetaMask etc.)
        if (!walletProvider) throw new Error('Wallet provider not available');
        const hexMessage = message.startsWith('0x')
          ? message
          : ('0x' + Array.from(new TextEncoder().encode(message))
              .map(b => b.toString(16).padStart(2, '0'))
              .join(''));
        signature = await walletProvider.request({
          method: 'personal_sign',
          params: [hexMessage, this.userAddress],
        });
      }
    } catch (error: any) {
      console.error('Error signing message:', error);
      throw new Error(error?.message || 'Failed to sign message');
    }

    // Log signature details for debugging
    const sigHex = signature.startsWith('0x') ? signature.slice(2) : signature;
    console.log(`[Auth] Raw signature length: ${sigHex.length / 2} bytes, starts: ${signature.slice(0, 20)}...`);

    // Unwrap ERC-6492 smart-account signatures so the server can verify
    // with standard ecrecover. This handles the case where Reown's embedded
    // wallet (Google/social login) produces a smart-account wrapped signature.
    const finalSig = this.unwrapERC6492(signature);

    const finalHex = finalSig.startsWith('0x') ? finalSig.slice(2) : finalSig;
    console.log(`[Auth] Final signature length: ${finalHex.length / 2} bytes`);

    return finalSig;
  }


  async getLoginToken(signature: string): Promise<string> {
    if (!this.userAddress) throw new Error('User address not set');

    const response = await axios.get(urls.open.getLoginToken, {
      headers: getOpenApiFormHeaders(),
      params: {
        address: this.userAddress,
        sign: signature,
        deviceId: API_CONFIG.DEVICE_ID.toString(),
        clientType: API_CONFIG.CLIENT_TYPE.toString(),
        clientVersion: API_CONFIG.CLIENT_VERSION.toString(),
      },
      withCredentials: true,
    });

    console.log('[Auth] getLoginToken raw response:', JSON.stringify(response.data));

    const data = response.data?.data;
    const token = data?.loginToken || data?.token || data?.accessToken ||
      response.data?.loginToken || response.data?.token || response.data?.accessToken ||
      (typeof data === 'string' && data.length > 10 ? data : null);

    if (!token) throw new Error(`Invalid login response - no token found. Response: ${JSON.stringify(response.data)}`);

    this.loginToken = token;
    this.tokenExpiry = Date.now() + (24 * 60 * 60 * 1000);
    localStorage.setItem('atm_token', token);
    localStorage.setItem('atm_token_expiry', this.tokenExpiry.toString());

    return token;
  }

  getCookie(): string | null {
    return document.cookie;
  }

  async authenticate(walletProvider: any, messageSigner?: (args: { message: string }) => Promise<string>): Promise<string> {
    if (this.authPromise) return this.authPromise;
    if (this.isTokenValid() && this.loginToken) return this.loginToken;

    this.authPromise = (async () => {
      try {
        const message = await this.getSignMessage();
        const signature = await this.signMessage(message, walletProvider, messageSigner);
        const token = await this.getLoginToken(signature);
        return token;
      } finally {
        this.authPromise = null;
      }
    })();

    return this.authPromise;
  }

  async getToken(walletProvider?: any, forceRefresh = false): Promise<string> {
    if (!forceRefresh && this.isTokenValid() && this.loginToken) {
      return this.loginToken;
    }
    if (!walletProvider) throw new Error('Wallet provider required for authentication');
    return await this.authenticate(walletProvider);
  }

  getAuthHeaders(): Record<string, string> {
    const token = this.loginToken || localStorage.getItem('atm_token');
    const cookie = this.cookie || localStorage.getItem('atm_cookie');

    if (!token) throw new Error('Not authenticated. Call authenticate() first.');

    const headers = getJsonHeaders(token);
    if (cookie) headers['Cookie'] = cookie;

    return headers;
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// WithdrawalService
// ─────────────────────────────────────────────────────────────────────────────
export class WithdrawalService {
  private balanceCache: { amount: number; timestamp: number } | null = null;
  private readonly BALANCE_CACHE_DURATION = 30000;
  private authService: AuthenticationService;

  constructor(authService: AuthenticationService) {
    this.authService = authService;
  }

  clearBalanceCache() {
    this.balanceCache = null;
  }

  async getWithdrawalBalance(walletProvider?: any): Promise<number> {
    if (this.balanceCache && Date.now() - this.balanceCache.timestamp < this.BALANCE_CACHE_DURATION) {
      return this.balanceCache.amount;
    }

    try {
      const token = await this.authService.getToken(walletProvider);
      const headers = getTokenJsonHeaders(token);

      const response = await axios.get(urls.open.getCurrentIncome, {
        headers,
        withCredentials: true,
      });

      if (response.data?.errorcode === 'NOT_LOGGEDIN' || response.data?.failed) {
        const newToken = await this.authService.authenticate(walletProvider);
        const retryHeaders = getTokenJsonHeaders(newToken);
        const retryResponse = await axios.get(urls.open.getCurrentIncome, {
          headers: retryHeaders,
          withCredentials: true,
        });
        if (retryResponse.data?.errorcode === 'NOT_LOGGEDIN') {
          throw new Error('Authentication required. Please try logging in again.');
        }
        const amount = this.extractAmount(retryResponse.data);
        this.balanceCache = { amount, timestamp: Date.now() };
        return amount;
      }

      const amount = this.extractAmount(response.data);
      this.balanceCache = { amount, timestamp: Date.now() };
      return amount;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error?.message || 'Failed to get withdrawal balance');
    }
  }

  private extractAmount(data: any): number {
    if (data?.data?.amount !== undefined) return data.data.amount;
    if (data?.amount !== undefined) return data.amount;
    if (typeof data?.data === 'number') return data.data;
    return 0;
  }

  private async getServerList(): Promise<{ serverList: Array<{ serverUrl: string }> }> {
    const token = localStorage.getItem('atm_token');
    const headers = getJsonHeaders(token);
    const config: any = { headers };
    if (shouldUseCredentials()) config.withCredentials = true;

    const response = await axios.get(urls.open.getServerList, config);
    if (response.data?.errorcode === 'NOT_LOGGEDIN' || response.data?.failed) {
      throw new Error('Authentication required for server list');
    }
    if (!response.data?.data?.serverList) throw new Error('Invalid server list response');
    return response.data.data;
  }

  private async getPRSignature(serverUrl: string, userAddress: string, amount: number, retryCount: number = 0): Promise<{ sign: string; expected_expiration: number; code: string } | null> {
    const MAX_RETRIES = 2;
    try {
      const token = localStorage.getItem('atm_token');
      console.log(`[PR Signature] Requesting from: ${serverUrl}${retryCount > 0 ? ` (retry ${retryCount})` : ''}`);

      const headers = getJsonHeaders(token);

      const obj = {
        user_address: userAddress,
        contract_address: '0x51E6Ac1533032E72e92094867fD5921e3ea1bfa0',
        amount: amount,
        timestamps: Math.floor(Date.now() / 1000) + 60 * 15,
      };

      const params = new URLSearchParams({
        url: `${serverUrl}/prod/assets/prefetching`,
        jsonParam: JSON.stringify(obj),
      });

      // Route through the OpenAPI proxy — backend forwards to EC2 server-side (no CORS)
      const endpoint = `${API_CONFIG.OPENAPI_BASE_URL}/open/getLucaWithdrawalSign?${params.toString()}`;

      console.log(`[PR Signature] Proxy endpoint: ${endpoint}`);

      const response = await axios.get(endpoint, {
        headers,
        timeout: 15000,
      });

      console.log(`[PR Signature] Response from ${serverUrl}:`, response.data);

      if (response.data?.errorcode === 'NOT_LOGGEDIN') {
        console.warn(`[PR Signature] NOT_LOGGEDIN error from ${serverUrl}`);
        return null;
      }

      if (response.data?.failed) {
        console.warn(`[PR Signature] Failed response from ${serverUrl}:`, response.data.msg);
        if (retryCount < MAX_RETRIES && response.data?.msg?.includes('busy')) {
          const delay = (retryCount + 1) * 2000;
          console.log(`[PR Signature] Retrying ${serverUrl} in ${delay}ms...`);
          await new Promise(resolve => setTimeout(resolve, delay));
          return this.getPRSignature(serverUrl, userAddress, amount, retryCount + 1);
        }
        return null;
      }

      // Proxy wraps EC2 response: response.data.data.data contains the actual payload
      const payload = response.data?.data?.data ?? response.data?.data;
      if (!payload?.sign) {
        console.warn(`[PR Signature] No signature in response from ${serverUrl}`);
        return null;
      }

      console.log(`[PR Signature] ✅ SUCCESS from ${serverUrl}`);
      return {
        sign: payload.sign,
        expected_expiration: payload.expected_expiration,
        code: payload.code,
      };
    } catch (error: any) {
      console.error(`[PR Signature] ❌ ERROR from ${serverUrl}:`, {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      });
      if (retryCount < MAX_RETRIES && (error.code === 'ECONNABORTED' || error.code === 'ERR_NETWORK' || error.response?.status >= 500)) {
        const delay = (retryCount + 1) * 2000;
        console.log(`[PR Signature] Retrying ${serverUrl} in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return this.getPRSignature(serverUrl, userAddress, amount, retryCount + 1);
      }
      return null;
    }
  }

  private async collectPRSignatures(amount: number): Promise<{ signs: string[]; expected_expiration: number; code: string }> {
    const userAddress = this.authService.getUserAddress();
    if (!userAddress) throw new Error('User address not set');

    console.log(`[Collect Signatures] Starting collection for amount: ${amount}`);
    console.log(`[Collect Signatures] User address: ${userAddress}`);

    console.log('[Collect Signatures] Fetching server list...');
    const serverList = await this.getServerList();
    console.log(`[Collect Signatures] Got ${serverList.serverList.length} servers`);

    const signs: string[] = [];
    let expected_expiration = 0;
    let code = '';
    const minCount = 18;
    const maxCount = 20;

    console.log(`[Collect Signatures] Making parallel requests to all servers...`);
    const signaturePromises = serverList.serverList.map((server, index) => {
      console.log(`[Collect Signatures] Request ${index + 1}/${serverList.serverList.length}: ${server.serverUrl}`);
      return this.getPRSignature(server.serverUrl, userAddress, amount);
    });

    const results = await Promise.allSettled(signaturePromises);

    console.log(`[Collect Signatures] All requests completed. Processing results...`);

    let successCount = 0;
    let failCount = 0;

    for (const result of results) {
      if (result.status === 'fulfilled' && result.value) {
        successCount++;
        signs.push(result.value.sign);
        expected_expiration = result.value.expected_expiration;
        code = result.value.code;
        console.log(`[Collect Signatures] ✅ Signature ${successCount} collected`);
        if (signs.length >= maxCount) break;
      } else {
        failCount++;
        console.log(`[Collect Signatures] ❌ Failed request ${failCount}`);
      }
    }

    console.log(`[Collect Signatures] Summary:`);
    console.log(`  - Success: ${successCount}`);
    console.log(`  - Failed: ${failCount}`);
    console.log(`  - Total collected: ${signs.length}`);
    console.log(`  - Required minimum: ${minCount}`);

    if (signs.length < minCount) {
      console.error(`[Collect Signatures] INSUFFICIENT SIGNATURES: ${signs.length}/${minCount}`);
      throw new Error(`Insufficient signatures: got ${signs.length}, need at least ${minCount}. Please wait 10 minutes and try again.`);
    }

    console.log(`[Collect Signatures] ✅ SUCCESS - Collected ${signs.length} signatures`);
    return { signs, expected_expiration, code };
  }

  private encodeUint8Array(values: number[]): string {
    const length = values.length.toString(16).padStart(64, '0');

    let packed = '';
    for (let i = 0; i < values.length; i += 32) {
      const chunk = values.slice(i, i + 32);
      const word = chunk.map(v => v.toString(16).padStart(2, '0')).join('').padEnd(64, '0');
      packed += word;
    }

    return length + packed;
  }

  private encodeBytes32Array(values: string[]): string {
    const length = values.length.toString(16).padStart(64, '0');

    let data = '';
    for (const value of values) {
      const cleaned = value.startsWith('0x') ? value.slice(2) : value;
      data += cleaned.padStart(64, '0');
    }

    return length + data;
  }

  private stringToBytes32(str: string): string {
    const hex = str.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    return '0x' + hex.padEnd(64, '0');
  }

  async executeWithdrawal(
    amount: number,
    signatures: string[],
    expiration: number,
    code: string,
    walletProvider: any
  ): Promise<any> {
    const userAddress = this.authService.getUserAddress();
    if (!userAddress) throw new Error('User address not set');

    try {
      const chainIdHex = await walletProvider.request({ method: 'eth_chainId' });
      const chainId = parseInt(chainIdHex, 16);
      if (chainId !== 56) {
        throw new Error(`Wrong network! Please switch to BSC Mainnet (chainId: 56). Current: ${chainId}`);
      }

      const { getChainById } = await import('../../config/chains');
      const chain = getChainById(56);
      const withdrawalContract = chain?.contracts.pledger;

      if (!withdrawalContract) {
        throw new Error('Withdrawal contract address not found for BSC');
      }

      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (currentTimestamp >= expiration) {
        throw new Error('Signatures have expired. Please try again to get fresh signatures.');
      }

      const lucaToken = chain?.contracts.luca || chain?.lucaContract;
      if (!lucaToken) {
        throw new Error('LUCA token address not found for BSC');
      }

      const v: number[] = [];
      const rs: string[] = [];
      for (const sig of signatures) {
        const r = sig.slice(0, 66);
        const s = '0x' + sig.slice(66, 130);
        const vByte = parseInt(sig.slice(130, 132), 16);
        v.push(vByte);
        rs.push(r, s);
      }

      const amountStr = String(amount);
      const [intPart, decPart = ''] = amountStr.split('.');
      const weiAmount = BigInt(intPart + decPart.padEnd(18, '0').slice(0, 18));

      const functionSelector = '0x3c423f0c';

      const addr1 = lucaToken.slice(2).toLowerCase().padStart(64, '0');
      const addr2 = userAddress.slice(2).toLowerCase().padStart(64, '0');

      const uint1 = weiAmount.toString(16).padStart(64, '0');
      const uint2 = expiration.toString(16).padStart(64, '0');

      const codeBytes32 = this.stringToBytes32(code).slice(2);

      const vsOffset = (5 * 32).toString(16).padStart(64, '0');

      const vsData = this.encodeUint8Array(v);
      const vsLength = vsData.length / 2;

      const rssOffset = (5 * 32 + vsLength).toString(16).padStart(64, '0');

      const rssData = this.encodeBytes32Array(rs);

      const data = functionSelector +
        addr1 +
        addr2 +
        uint1 +
        uint2 +
        codeBytes32 +
        vsOffset +
        rssOffset +
        vsData +
        rssData;

      console.log('Executing withdrawal transaction...');
      console.log('Contract:', withdrawalContract);
      console.log('Amount:', amount, 'LUCA');
      console.log('Signatures:', signatures.length);

      const txHash = await walletProvider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: userAddress,
          to: withdrawalContract,
          data,
          gas: '0x186a0'
        }]
      });

      console.log('Transaction sent:', txHash);

      for (let i = 0; i < 60; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const receipt = await walletProvider.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        });

        if (receipt) {
          if (receipt.status === '0x0') {
            throw new Error('Transaction failed on blockchain');
          }
          console.log('Withdrawal confirmed:', receipt);
          return { hash: txHash, transactionHash: txHash, receipt };
        }
      }

      throw new Error('Transaction timeout - please check transaction status manually');

    } catch (error: any) {
      console.error('Withdrawal execution error:', error);

      if (error?.code === 'ACTION_REJECTED' || error?.code === 4001) {
        throw new Error('Transaction rejected by user');
      }

      throw new Error(error?.message || 'Failed to execute withdrawal');
    }
  }

  async withdrawLUCA(amount: number, walletProvider: any): Promise<WithdrawalResult> {
    try {
      const prSignatures = await this.collectPRSignatures(amount);
      const receipt = await this.executeWithdrawal(
        amount,
        prSignatures.signs,
        prSignatures.expected_expiration,
        prSignatures.code,
        walletProvider
      );
      return {
        success: true,
        transactionHash: receipt.hash || receipt.transactionHash
      };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Withdrawal failed'
      };
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CommunityProposalService
// ─────────────────────────────────────────────────────────────────────────────
export class CommunityProposalService {
  private authService: AuthenticationService;

  constructor(authService: AuthenticationService) {
    this.authService = authService;
  }

  async getMyPartList(status: string | number, searchKeys: string, pageIndex: number = 1, pageSize: number = 20, walletProvider?: any): Promise<ProposalListResponse> {
    try {
      const token = await this.authService.getToken(walletProvider);
      const headers: Record<string, string> = { 'Content-Type': 'application/x-www-form-urlencoded', 'token': token };
      if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

      const params = new URLSearchParams({ status: String(status || ''), searchKeys: searchKeys || '', pageIndex: String(pageIndex), pageSize: String(pageSize) });
      const response = await axios.post(urls.community.getMyPartList, params, { headers, withCredentials: true });

      if (response.data?.errorcode === 'NOT_LOGGEDIN' || !response.data?.success) {
        const newToken = await this.authService.authenticate(walletProvider);
        headers['token'] = newToken;
        const retryResponse = await axios.post(urls.community.getMyPartList, params, { headers, withCredentials: true });
        return retryResponse.data;
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error?.message || 'Failed to get proposals');
    }
  }

  async getMyInitiateList(status: string | number, searchKeys: string, pageIndex: number = 1, pageSize: number = 20, walletProvider?: any): Promise<ProposalListResponse> {
    try {
      const token = await this.authService.getToken(walletProvider);
      const headers: Record<string, string> = { 'Content-Type': 'application/x-www-form-urlencoded', 'token': token };
      if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

      const params = new URLSearchParams({ status: String(status || ''), searchKeys: searchKeys || '', pageIndex: String(pageIndex), pageSize: String(pageSize) });
      const response = await axios.post(urls.community.getMyInitiateList, params, { headers, withCredentials: true });

      if (response.data?.errorcode === 'NOT_LOGGEDIN' || !response.data?.success) {
        const newToken = await this.authService.authenticate(walletProvider);
        headers['token'] = newToken;
        const retryResponse = await axios.post(urls.community.getMyInitiateList, params, { headers, withCredentials: true });
        return retryResponse.data;
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error?.message || 'Failed to get proposals');
    }
  }

  async withdrawAGT(keyIds: string[], walletProvider?: any): Promise<{ success: boolean; message?: string }> {
    try {
      const token = await this.authService.getToken(walletProvider);
      const headers: Record<string, string> = { 'Content-Type': 'application/json', 'token': token };
      if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

      const response = await axios.post(urls.community.withdrawAGT, { keyIds }, { headers, withCredentials: true });

      if (response.data?.errorcode === 'NOT_LOGGEDIN' || !response.data?.success) {
        const newToken = await this.authService.authenticate(walletProvider);
        headers['token'] = newToken;
        const retryResponse = await axios.post(urls.community.withdrawAGT, { keyIds }, { headers, withCredentials: true });
        return { success: retryResponse.data?.success || false, message: retryResponse.data?.message };
      }
      return { success: response.data?.success || false, message: response.data?.message };
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error?.message || 'Failed to withdraw AGT');
    }
  }

  getStatusText(status: number, typeOfProposal?: string): string {
    const statusMap: Record<string, Record<number, string>> = {
      '3': { 0: 'Inactive', 1: 'Under review', 2: 'Changes required', 3: 'Approved', 4: 'Rejected', 5: 'Contribution stage', 6: 'Released', 7: 'Development' },
      default: { 1: 'Under review', 2: 'Approved', 3: 'Rejected', 4: 'In progress', 5: 'Ended', 6: 'Invalid' },
    };
    return statusMap[typeOfProposal === '3' ? '3' : 'default'][status] || 'Unknown';
  }

  async createCommunityProposal(proposalData: any, walletProvider?: any): Promise<{ success: boolean; message?: string }> {
    try {
      const token = await this.authService.getToken(walletProvider);
      const headers: Record<string, string> = { 'Content-Type': 'application/json', 'token': token };
      if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

      const response = await axios.post(
        urls.community.createProposal,
        proposalData,
        { headers, withCredentials: true }
      );

      if (response.data?.errorcode === 'NOT_LOGGEDIN' || !response.data?.success) {
        const newToken = await this.authService.authenticate(walletProvider);
        headers['token'] = newToken;
        const retryResponse = await axios.post(
          urls.community.createProposal,
          proposalData,
          { headers, withCredentials: true }
        );
        return { success: retryResponse.data?.success || false, message: retryResponse.data?.message };
      }
      return { success: response.data?.success || false, message: response.data?.message };
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error?.message || 'Failed to create proposal');
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ConsensusConnectionService
// ─────────────────────────────────────────────────────────────────────────────
export class ConsensusConnectionService {
  private authService: AuthenticationService;

  constructor(authService: AuthenticationService) {
    this.authService = authService;
  }

  async getLinkList(linkStatus: number, userWalletAddress?: string, chainId?: string, walletProvider?: any) {
    try {
      const token = await this.authService.getToken(walletProvider);
      const headers: Record<string, string> = { 'Content-Type': 'application/json', 'token': token };
      if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

      const response = await axios.get(urls.open.getUserConnList, {
        headers,
        withCredentials: true,
        params: { linkStatus, pageIndex: 1, pageSize: 100, ...(userWalletAddress && { userWalletAddress }), ...(chainId && { chainId }) },
      });

      if (response.data?.errorcode === 'NOT_LOGGEDIN' || response.data?.failed) {
        const newToken = await this.authService.authenticate(walletProvider);
        headers['token'] = newToken;
        const retryResponse = await axios.get(urls.open.getUserConnList, {
          headers,
          withCredentials: true,
          params: { linkStatus, pageIndex: 1, pageSize: 100, ...(userWalletAddress && { userWalletAddress }), ...(chainId && { chainId }) },
        });
        if (retryResponse.data?.errorcode === 'NOT_LOGGEDIN') throw new Error('Authentication required');
        return this.extractLinkList(retryResponse.data);
      }
      return this.extractLinkList(response.data);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error?.message || 'Failed to get link list');
    }
  }

  private extractLinkList(data: any) {
    return {
      linkList: data?.data?.linkList || [],
      waitDealCount: data?.data?.waitDealCount || 0,
      otherDealCount: data?.data?.otherDealCount || 0,
      linkCount: data?.data?.linkCount || 0,
    };
  }

  async getPledgeableList(walletProvider?: any): Promise<ConsensusConnection[]> {
    try {
      const token = await this.authService.getToken(walletProvider);
      const headers: Record<string, string> = { 'Content-Type': 'application/json', 'token': token };
      if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

      const response = await axios.get(urls.open.getTreatyList, { headers, withCredentials: true });

      if (response.data?.errorcode === 'NOT_LOGGEDIN' || response.data?.failed) {
        const newToken = await this.authService.authenticate(walletProvider);
        headers['token'] = newToken;
        const retryResponse = await axios.get(urls.open.getTreatyList, { headers, withCredentials: true });
        if (retryResponse.data?.errorcode === 'NOT_LOGGEDIN') throw new Error('Authentication required');
        return this.extractConnectionList(retryResponse.data);
      }
      return this.extractConnectionList(response.data);
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error?.message || 'Failed to get pledgeable list');
    }
  }

  private extractConnectionList(data: any): ConsensusConnection[] {
    if (data?.data?.treatyList) return data.data.treatyList;
    if (data?.treatyList) return data.treatyList;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data)) return data;
    return [];
  }

  async updatePledgeStatus(connectionId: number, nodeAddress: string, action: 'pledge' | 'depledge', walletProvider?: any) {
    try {
      const token = await this.authService.getToken(walletProvider);
      const headers: Record<string, string> = { 'Content-Type': 'application/json', 'token': token };
      if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

      const payload = { treatyId: connectionId, nodeAddress, action };
      const response = await axios.post(urls.open.updateLedgeStatus, payload, { headers, withCredentials: true });

      if (response.data?.errorcode === 'NOT_LOGGEDIN' || response.data?.failed) {
        const newToken = await this.authService.authenticate(walletProvider);
        headers['token'] = newToken;
        const retryResponse = await axios.post(urls.open.updateLedgeStatus, payload, { headers, withCredentials: true });
        if (retryResponse.data?.errorcode === 'NOT_LOGGEDIN') throw new Error('Authentication required');
        return { success: retryResponse.data?.success !== false, message: retryResponse.data?.message || 'Pledge status updated' };
      }
      return { success: response.data?.success !== false, message: response.data?.message || 'Pledge status updated' };
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error?.message || 'Failed to update pledge status');
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// ConnectionCreationService
// ─────────────────────────────────────────────────────────────────────────────
export class ConnectionCreationService {
  private authService: AuthenticationService;

  constructor(authService: AuthenticationService) {
    this.authService = authService;
  }

  validateAddress(address: string): boolean {
    if (!address || typeof address !== 'string') return false;
    if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return false;
    return true;
  }

  private toWei(amount: number, decimals: number): bigint {
    const amountStr = amount.toFixed(decimals);
    const [intPart, decPart = ''] = amountStr.split('.');
    const paddedDec = decPart.padEnd(decimals, '0');
    return BigInt(intPart + paddedDec);
  }

  private encodeString(str: string): string {
    const hex = str.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    const length = str.length.toString(16).padStart(64, '0');
    const paddedHex = hex.padEnd(Math.ceil(hex.length / 64) * 64, '0');
    return length + paddedHex;
  }

  getTokenAddress(currency: string, currencyList: CoinCurrency[]): string | null {
    if (!currencyList?.length) return null;
    const data = currencyList.find(
      item => item.baseCurrency.toLowerCase() === currency.toLowerCase()
    );
    return data?.gateWay || null;
  }

  async checkNetworkMatch(selectedChainId: number, walletProvider: any): Promise<boolean> {
    if (!walletProvider) return false;

    try {
      const chainIdHex = await walletProvider.request({ method: 'eth_chainId' });
      const currentChainId = parseInt(chainIdHex, 16);
      return currentChainId === selectedChainId;
    } catch (error) {
      console.error('Network check failed:', error);
      return false;
    }
  }

  async isAllowanceV2(
    currency: string,
    approveAddress: string,
    amountBase: bigint,
    currencyList: CoinCurrency[],
    walletProvider: any
  ): Promise<boolean> {
    if (['BNB', 'ETH', 'MATIC', 'AVAX', 'KUB'].includes(currency)) return true;

    const tokenAddress = currency.includes('0x')
      ? currency
      : this.getTokenAddress(currency, currencyList);

    if (!tokenAddress) return false;

    try {
      const address = this.authService.getUserAddress();
      if (!address) throw new Error('User address not set');

      const data = '0xdd62ed3e' +
        address.slice(2).toLowerCase().padStart(64, '0') +
        approveAddress.slice(2).toLowerCase().padStart(64, '0');

      const allowanceData = await walletProvider.request({
        method: 'eth_call',
        params: [{ to: tokenAddress, data }, 'latest']
      });

      const allowance = BigInt(allowanceData);
      console.log('Allowance check:', {
        currency,
        allowance: allowance.toString(),
        required: amountBase.toString(),
        hasAllowance: allowance >= amountBase
      });

      return allowance >= amountBase;
    } catch (error: any) {
      console.warn('Allowance check failed (will attempt approval):', error.message);

      if (error.code && String(error.code).startsWith('-32')) {
        console.log('RPC error detected, skipping allowance check and proceeding to approval');
        return false;
      }

      return false;
    }
  }

  async approveSpend(
    currency: string,
    contractForApproval: string,
    amount: number,
    currencyList: CoinCurrency[],
    walletProvider: any
  ): Promise<{ status: boolean; msg?: string }> {
    const tokenAddress = currency.includes('0x')
      ? currency
      : this.getTokenAddress(currency, currencyList);

    if (!tokenAddress) {
      return { status: false, msg: 'Token address not found' };
    }

    const currencyData = currencyList.find(item => item.baseCurrency === currency);
    const weiPlaces = Number(currencyData?.weiPlaces || '18');

    try {
      const address = this.authService.getUserAddress();
      if (!address) throw new Error('User address not set');

      const MAX_UINT256 = BigInt('0xffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff');

      const amountStr = amount.toFixed(weiPlaces);
      const [intPart, decPart = ''] = amountStr.split('.');
      const paddedDec = decPart.padEnd(weiPlaces, '0').slice(0, weiPlaces);
      const exactWeiAmount = BigInt(intPart + paddedDec);

      console.log('Approval amount:', {
        original: amount,
        weiPlaces,
        exactWei: exactWeiAmount.toString(),
        approving: 'MaxUint256 (unlimited)',
      });

      const data = '0x095ea7b3' +
        contractForApproval.slice(2).toLowerCase().padStart(64, '0') +
        MAX_UINT256.toString(16).padStart(64, '0');

      const txHash = await walletProvider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: tokenAddress,
          data,
          gas: '0x15f90'
        }]
      });

      console.log('Approval tx sent, waiting for receipt:', txHash);

      for (let i = 0; i < 60; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const receipt = await walletProvider.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        });

        if (receipt) {
          if (receipt.status === '0x0') {
            throw new Error('Approval transaction failed on-chain');
          }
          console.log('Approval confirmed in block:', receipt.blockNumber, 'txHash:', txHash);
          return { status: true };
        }

        if (i % 5 === 0 && i > 0) {
          console.log(`Waiting for approval confirmation... (${i * 2}s)`);
        }
      }

      throw new Error('Approval timeout - transaction may still be pending, please check your wallet');
    } catch (err: any) {
      console.error('Approve error:', err);
      if (err.code === 4001 || err.code === 'ACTION_REJECTED') {
        return { status: false, msg: 'Transaction rejected by user' };
      }
      return { status: false, msg: err.message || 'Approval failed' };
    }
  }

  async checkNFTApproval(tokenId: string, nftAddress: string, factoryAddress: string, walletProvider: any): Promise<boolean> {
    try {
      const data = '0x081812fc' + BigInt(tokenId).toString(16).padStart(64, '0');

      const result = await walletProvider.request({
        method: 'eth_call',
        params: [{ to: nftAddress, data }, 'latest']
      });

      const approved = '0x' + result.slice(26);
      return approved.toLowerCase() === factoryAddress.toLowerCase();
    } catch (error) {
      console.error('Failed to check NFT approval:', error);
      return false;
    }
  }

  async approveNFT(tokenId: string, nftAddress: string, factoryAddress: string, walletProvider: any): Promise<void> {
    const address = this.authService.getUserAddress();
    if (!address) throw new Error('User address not set');

    const data = '0x095ea7b3' +
      factoryAddress.slice(2).toLowerCase().padStart(64, '0') +
      BigInt(tokenId).toString(16).padStart(64, '0');

    const txHash = await walletProvider.request({
      method: 'eth_sendTransaction',
      params: [{
        from: address,
        to: nftAddress,
        data,
        gas: '0x15f90'
      }]
    });

    for (let i = 0; i < 60; i++) {
      await new Promise(resolve => setTimeout(resolve, 2000));
      const receipt = await walletProvider.request({
        method: 'eth_getTransactionReceipt',
        params: [txHash]
      });

      if (receipt) {
        if (receipt.status === '0x0') {
          throw new Error('NFT approval failed');
        }
        console.log('NFT approval successful:', txHash);
        return;
      }
    }

    throw new Error('NFT approval timeout');
  }

  async checkNFTOwnership(tokenId: string, nftAddress: string, walletProvider: any): Promise<boolean> {
    try {
      const address = this.authService.getUserAddress();
      if (!address) return false;

      const data = '0x6352211e' + BigInt(tokenId).toString(16).padStart(64, '0');

      const result = await walletProvider.request({
        method: 'eth_call',
        params: [{ to: nftAddress, data }, 'latest']
      });

      const owner = '0x' + result.slice(26);
      return owner.toLowerCase() === address.toLowerCase();
    } catch (error) {
      console.error('Failed to check NFT ownership:', error);
      return false;
    }
  }

  async createTokenConnection(
    toAddress: string,
    tokenSymbol: string,
    totalAmount: bigint,
    percentA: number,
    lockupDays: number,
    factoryAddress: string,
    walletProvider: any
  ): Promise<string> {
    const address = this.authService.getUserAddress();
    if (!address) throw new Error('User address not set');

    try {
      console.log('Creating token connection:', {
        toAddress,
        tokenSymbol,
        totalAmount: totalAmount.toString(),
        percentA,
        lockupDays,
        factoryAddress
      });

      const functionSelector = '4aff6754';

      const addressParam = toAddress.slice(2).toLowerCase().padStart(64, '0');
      const stringOffset = (5 * 32).toString(16).padStart(64, '0');
      const totalAmountParam = totalAmount.toString(16).padStart(64, '0');
      const percentAParam = BigInt(percentA).toString(16).padStart(64, '0');
      const lockDaysParam = BigInt(lockupDays).toString(16).padStart(64, '0');

      const stringLength = tokenSymbol.length.toString(16).padStart(64, '0');
      const stringBytes = tokenSymbol.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
      const stringData = stringBytes.padEnd(Math.ceil(stringBytes.length / 64) * 64, '0');

      const data = '0x' + functionSelector +
        addressParam +
        stringOffset +
        totalAmountParam +
        percentAParam +
        lockDaysParam +
        stringLength +
        stringData;

      const myAmount = (totalAmount * BigInt(percentA)) / BigInt(100);
      const isNativeToken = ['BNB', 'ETH', 'MATIC', 'AVAX', 'KUB'].includes(tokenSymbol);
      const value = isNativeToken ? '0x' + myAmount.toString(16) : '0x0';

      console.log('createLink tx:', {
        data,
        value,
        isNativeToken,
        to: factoryAddress,
        from: address,
      });

      let gasEstimate: string | undefined;
      try {
        gasEstimate = await walletProvider.request({
          method: 'eth_estimateGas',
          params: [{
            from: address,
            to: factoryAddress,
            data,
            value,
          }]
        });
      } catch (estimateError: any) {
        console.error('Gas estimation failed (contract will likely revert):', estimateError);
        const errMsg = estimateError?.data?.message || estimateError?.message || 'Unknown revert reason';
        throw new Error(`Contract call would revert: ${errMsg}. Please check that the token is supported and all parameters are correct.`);
      }

      const txHash = await walletProvider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: factoryAddress,
          data,
          value,
          gas: gasEstimate || '0x7a120'
        }]
      });

      console.log('Transaction sent:', txHash);

      for (let i = 0; i < 60; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const receipt = await walletProvider.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        });

        if (receipt) {
          console.log('Transaction receipt:', receipt);
          if (receipt.status === '0x0') {
            throw new Error('Transaction failed - please check contract requirements and try again');
          }
          return txHash;
        }

        if (i % 5 === 0 && i > 0) {
          console.log(`Waiting for confirmation... (${i * 2}s)`);
        }
      }

      throw new Error('Transaction timeout - please check blockchain explorer');
    } catch (error: any) {
      console.error('Create token connection error:', error);
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        throw new Error('Transaction rejected by user');
      }
      throw error;
    }
  }

  async createNFTConnection(
    nftAddress: string,
    toAddress: string,
    tokenList: string[],
    lockupDays: number,
    factoryAddress: string,
    walletProvider: any
  ): Promise<string> {
    const address = this.authService.getUserAddress();
    if (!address) throw new Error('User address not set');

    try {
      console.log('Creating NFT connection:', {
        nftAddress,
        toAddress,
        tokenList,
        lockupDays,
        factoryAddress
      });

      throw new Error('NFT connection not yet implemented - please check contract ABI for NFT function');
    } catch (error: any) {
      console.error('Create NFT connection error:', error);
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        throw new Error('Transaction rejected by user');
      }
      throw error;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// IncomeService
// ─────────────────────────────────────────────────────────────────────────────
export class IncomeService {
  private readonly PAGE_SIZE = 20;
  private authService: AuthenticationService;
  private encryptionService: EncryptionService;

  constructor(authService: AuthenticationService, encryptionService: EncryptionService) {
    this.authService = authService;
    this.encryptionService = encryptionService;
  }

  private addressCacheKey(prefix: string): string {
    const address = this.authService.getUserAddress() || 'anon';
    return `${prefix}_${address}`;
  }

  async getIncomeHistory(startTimestamps?: number, endTimestamps?: number): Promise<IncomeRecord[]> {
    const cacheKey = `${this.addressCacheKey('income')}_${startTimestamps}_${endTimestamps}`;
    const cached = await this.encryptionService.getCache(cacheKey);
    if (cached) return cached;

    const token = await this.authService.getToken();
    let allData: IncomeRecord[] = [];
    let lastEvalKey = '';

    while (true) {
      const headers = getJsonHeaders(token);

      const config: any = { headers, params: { pageSize: this.PAGE_SIZE, lastEvaluatedKey: lastEvalKey } };
      if (startTimestamps) config.params.startTimestamps = startTimestamps;
      if (endTimestamps) config.params.endTimestamps = endTimestamps;
      if (shouldUseCredentials()) config.withCredentials = true;

      const response = await axios.get(urls.open.getIncomeHistory, config);
      if (response.data?.status === 'failed' || !response.data?.data) break;

      allData = [...allData, ...response.data.data];
      if (!response.data.mapData?.last_evaluated_key) break;
      lastEvalKey = response.data.mapData.last_evaluated_key;
    }

    await this.encryptionService.setCache(cacheKey, allData, CACHE_TTL);
    return allData;
  }

  async getAllIncomeHistory(): Promise<IncomeRecord[]> {
    return this.getIncomeHistory();
  }

  async getWithdrawalHistory(startTimestamps?: number, endTimestamps?: number): Promise<WithdrawalRecord[]> {
    const cacheKey = `${this.addressCacheKey('withdrawal')}_${startTimestamps}_${endTimestamps}`;
    const cached = await this.encryptionService.getCache(cacheKey);
    if (cached) return cached;

    const token = await this.authService.getToken();
    let allData: WithdrawalRecord[] = [];
    let lastEvalKey = '';

    while (true) {
      const headers = getJsonHeaders(token);

      const config: any = { headers, params: { pageSize: this.PAGE_SIZE, lastEvaluatedKey: lastEvalKey } };
      if (startTimestamps) config.params.startTimestamps = startTimestamps;
      if (endTimestamps) config.params.endTimestamps = endTimestamps;
      if (shouldUseCredentials()) config.withCredentials = true;

      const response = await axios.get(urls.open.getWithdrawalHistory, config);
      if (response.data?.status === 'failed' || !response.data?.data) break;

      allData = [...allData, ...response.data.data];
      if (!response.data.mapData?.last_evaluated_key) break;
      lastEvalKey = response.data.mapData.last_evaluated_key;
    }

    await this.encryptionService.setCache(cacheKey, allData, CACHE_TTL);
    return allData;
  }

  async getAllWithdrawalHistory(): Promise<WithdrawalRecord[]> {
    return this.getWithdrawalHistory();
  }

  async getRecentIncomeHistory(days: number = 20): Promise<IncomeRecord[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return this.getIncomeHistory(startDate.getTime(), endDate.getTime());
  }

  async getIncomeHistoryPaginated(offset: number = 0, limit: number = 20): Promise<IncomeRecord[]> {
    const cacheKey = `${this.addressCacheKey('income_paginated')}_${offset}_${limit}`;
    const cached = await this.encryptionService.getCache(cacheKey);
    if (cached) return cached;

    const token = await this.authService.getToken();
    const headers = getJsonHeaders(token);

    const config: any = { headers, params: { pageSize: limit, offset } };
    if (shouldUseCredentials()) config.withCredentials = true;

    const response = await axios.get(urls.open.getIncomeHistory, config);
    const data = response.data?.data || [];
    await this.encryptionService.setCache(cacheKey, data, CACHE_TTL);
    return data;
  }

  async getRecentWithdrawalHistory(days: number = 30): Promise<WithdrawalRecord[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return this.getWithdrawalHistory(Math.floor(startDate.getTime() / 1000), Math.floor(endDate.getTime() / 1000));
  }

  clearCache(): void {
    // Clear only this user's income/withdrawal entries so other wallets are unaffected.
    const address = this.authService.getUserAddress() || 'anon';
    const prefixes = [`income_${address}`, `withdrawal_${address}`, `income_paginated_${address}`];
    Object.keys(localStorage)
      .filter(k => k.startsWith(CACHE_PREFIX) && prefixes.some(p => k.includes(p)))
      .forEach(k => localStorage.removeItem(k));
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// GameService
// ─────────────────────────────────────────────────────────────────────────────
export class GameService {
  private getCommonHeaders(): Record<string, string> {
    const token = localStorage.getItem('atm_token');
    return getJsonHeadersMinimal(token);
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('atm_token');
    return {
      'Content-Type': 'application/json',
      'Cssg-Language': API_CONFIG.DEFAULT_LANGUAGE,
      ...(token && { token }),
    };
  }

  private getUserDataFromStorage() {
    try {
      const userData = localStorage.getItem('userData');
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      return null;
    }
  }

  async createProposal(data: Partial<GameProposal>): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(urls.game.createProposal, data, { headers: this.getCommonHeaders(), withCredentials: true });
      return { message: response.data.message || 'Success', isSuccess: response.data.success || false, success: response.data.success || false, data: response.data.data };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async updateProposal(data: Partial<GameProposal>): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(urls.game.updateProposal, data, { headers: this.getCommonHeaders(), withCredentials: true });
      return { message: response.data.message || 'Success', isSuccess: response.data.success || false, success: response.data.success || false, data: response.data.data };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async getProposalByUserId(): Promise<ApiResponse<GameProposal[]>> {
    try {
      const userData = this.getUserDataFromStorage();
      if (!userData?.user?.id) throw new Error('User not authenticated');
      const response = await axios.post(urls.game.getProposalByUserId, { userId: userData.user.id }, { headers: this.getCommonHeaders(), withCredentials: true });
      return { data: response.data.data || [], isSuccess: response.data.success || false, success: response.data.success || false, message: 'Success' };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async getAdminProposal(): Promise<ApiResponse<GameProposal[]>> {
    try {
      const response = await axios.post(urls.game.getAllProposal, { blank: 'blank' }, { withCredentials: true, headers: this.getAuthHeaders() });
      return { data: response.data.data || [], isSuccess: response.data.success || false, success: response.data.success || false, message: 'Success' };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async updateProposalByAdmin(dataObject: any): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(urls.game.updateGameStatus, dataObject, { withCredentials: true, headers: this.getAuthHeaders() });
      return { data: response.data.data || '', isSuccess: response.data.success || false, success: response.data.success || false, message: 'Success' };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async getAllGame(): Promise<ApiResponse<Game[]>> {
    try {
      const response = await axios.post(urls.game.getAllGame, {}, { headers: this.getCommonHeaders(), withCredentials: true });
      return { data: response.data.data || [], isSuccess: response.data.success || false, success: response.data.success || false, message: 'Success' };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async getGameById(gameId: string): Promise<ApiResponse<Game>> {
    try {
      const response = await axios.post(urls.game.getGameById, { id: gameId }, { headers: this.getCommonHeaders(), withCredentials: true });
      return { data: response.data.data, isSuccess: response.data.success || false, success: response.data.success || false, message: 'Success' };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async gameRating(dataObject: GameRating): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem('atm_token');
      const apiUrl = token ? urls.game.knownRating : urls.game.anonymousRating;
      const response = await axios.post(apiUrl, dataObject, { ...(token && { withCredentials: true }), headers: token ? this.getAuthHeaders() : this.getCommonHeaders() });
      return { data: response.data.data || '', isSuccess: response.data.success || false, success: response.data.success || false, message: 'Success' };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async gameContributed(dataObject: GameInvestment): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(urls.game.invest, dataObject, { withCredentials: true, headers: this.getAuthHeaders() });
      return { data: response.data.data || '', isSuccess: response.data.success || false, success: response.data.success || false, message: 'Success' };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async createBattle(data: BattleData): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(urls.game.createBattle, data, { headers: this.getCommonHeaders(), withCredentials: true });
      return { data: response.data.data || null, isSuccess: response.data.success || false, success: response.data.success || false, message: response.data.msg || 'Success', errorcode: response.data.errorcode, failed: response.data.failed, mapData: response.data.mapData, state: response.data.state, status: response.data.status, total: response.data.total };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async updateBattle(data: UpdateBattleData): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(urls.game.updateBattle, data, { headers: this.getCommonHeaders(), withCredentials: true });
      return { data: response.data.data || null, isSuccess: response.data.success || false, success: response.data.success || false, message: response.data.msg || 'Success', errorcode: response.data.errorcode, failed: response.data.failed, mapData: response.data.mapData, state: response.data.state, status: response.data.status, total: response.data.total };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async getStars(data: UserStarsData): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(urls.game.getStars, data, { headers: this.getCommonHeaders(), withCredentials: true });
      return { data: response.data.data || null, isSuccess: response.data.success || false, success: response.data.success || false, message: response.data.msg || 'Success', errorcode: response.data.errorcode, failed: response.data.failed, mapData: response.data.mapData, state: response.data.state, status: response.data.status, total: response.data.total };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async submitJoinATMApplication(formData: JoinATMFormData, errorText: string = 'Something went wrong'): Promise<{ message: string; isSuccess: boolean }> {
    try {
      const data = JSON.stringify({
        title: formData.projectName,
        overview: `<h3>Project Information</h3><p><strong>Project Name:</strong> ${formData.projectName}</p><p><strong>Project Token:</strong> ${formData.projectToken || 'N/A'}</p><p><strong>LUCA Community:</strong> ${formData.lucaCommunity}</p><p><strong>LUCA Candy Value:</strong> $${formData.lucaCandyValue || 'N/A'}</p><p><strong>Project Link:</strong> <a href="${formData.projectLink}" target="_blank">${formData.projectLink}</a></p>${formData.whiteBookLink ? `<p><strong>White Paper:</strong> <a href="${formData.whiteBookLink}" target="_blank">${formData.whiteBookLink}</a></p>` : ''}${formData.projectMedia ? `<p><strong>Media/Blog:</strong> <a href="${formData.projectMedia}" target="_blank">${formData.projectMedia}</a></p>` : ''}<h3>Project Introduction</h3><p>${formData.projectIntroduction}</p>`,
        gameplay: `<h3>Team & Support</h3><p>${formData.teamSupport}</p><h3>Contract Platform</h3><p>${formData.contractPlatform}</p>`,
        gamesMediaModelList: [],
        connectionDetails: JSON.stringify({ lucaCommunity: formData.lucaCommunity, lucaCandyValue: formData.lucaCandyValue || '0', applicationType: 'JOIN_ATM' }),
        funds: 0, images: '', video: '', status: 1, createdBy: 0, categoriesIds: ['13'],
        contactDetails: [{ name: 'email', description: formData.email, link: formData.email, images: 'Not found' }, { name: 'Project Link', description: formData.projectLink, link: formData.projectLink, images: 'Not found' }],
        milestones: []
      });

      const response = await axios({ method: 'post', maxBodyLength: Infinity, url: urls.game.createProposal, headers: this.getCommonHeaders(), data });
      return { message: response.data.message || response.data.data || 'Application submitted successfully', isSuccess: response.data.success || false };
    } catch (error) {
      return { message: errorText, isSuccess: false };
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AuthorizationService
// ─────────────────────────────────────────────────────────────────────────────
export class AuthorizationService {

  getTokenList(chainId: number): TokenInfo[] {
    const tokenLists: Record<number, TokenInfo[]> = {
      56: [
        { symbol: "LUCA", address: "0x51E6Ac1533032E72e92094867fD5921e3ea1bfa0", decimals: 18, logo: "/assets/currency/luca2.svg" },
        { symbol: "USDC", address: "0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d", decimals: 18, logo: "/assets/currency/USDC.svg" },
        { symbol: "USDT", address: "0x55d398326f99059fF775485246999027B3197955", decimals: 18, logo: "/assets/currency/USDT.svg" },
        { symbol: "BUSD", address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56", decimals: 18, logo: "/assets/currency/BUSD.svg" }
      ],
      97: [
        { symbol: "LUCA", address: "0xD7a1cA21D73ff98Cc64A81153eD8eF89C2a1EfEF", decimals: 18, logo: "/assets/currency/luca2.svg" },
        { symbol: "USDC", address: "0xD7a1cA21D73ff98Cc64A81153eD8eF89C2a1EfEF", decimals: 18, logo: "/assets/currency/USDC.svg" },
        { symbol: "USDT", address: "0x18083a14d319E6AAee7c1355f00B94c65C845ADf", decimals: 18, logo: "/assets/currency/USDT.svg" }
      ],
      1: [
        { symbol: "USDC", address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48", decimals: 6, logo: "/assets/currency/USDC.svg" },
        { symbol: "USDT", address: "0xdAC17F958D2ee523a2206206994597C13D831ec7", decimals: 6, logo: "/assets/currency/USDT.svg" }
      ],
      137: [
        { symbol: "LUCA", address: "0xb3d3e098564e5bEDCDA5c15E0f0E005560bE82c8", decimals: 18, logo: "/assets/currency/luca2.svg" },
        { symbol: "USDC", address: "0x2791Bca1f2de4661ED88A30C99A7a9449Aa84174", decimals: 6, logo: "/assets/currency/USDC.svg" },
        { symbol: "USDT", address: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F", decimals: 6, logo: "/assets/currency/USDT.svg" }
      ]
    };
    return tokenLists[chainId] || [];
  }

  private formatUnits(value: bigint, decimals: number): string {
    const valueStr = value.toString();
    const isNegative = valueStr.startsWith('-');
    const absoluteValue = isNegative ? valueStr.slice(1) : valueStr;

    if (decimals === 0) return absoluteValue;

    const paddedValue = absoluteValue.padStart(decimals + 1, '0');
    const integerPart = paddedValue.slice(0, -decimals) || '0';
    const decimalPart = paddedValue.slice(-decimals);

    const trimmedDecimal = decimalPart.replace(/0+$/, '');

    if (trimmedDecimal === '') {
      return (isNegative ? '-' : '') + integerPart;
    }

    return (isNegative ? '-' : '') + integerPart + '.' + trimmedDecimal;
  }

  async checkAllowance(
    tokenAddress: string,
    spenderAddress: string,
    decimals: number,
    address: string,
    walletProvider: any
  ): Promise<string> {
    if (!address || !walletProvider) return "0";

    try {
      const data = '0xdd62ed3e' +
        address.slice(2).toLowerCase().padStart(64, '0') +
        spenderAddress.slice(2).toLowerCase().padStart(64, '0');

      const allowanceData = await walletProvider.request({
        method: 'eth_call',
        params: [{ to: tokenAddress, data }, 'latest']
      });

      const allowance = BigInt(allowanceData);
      return this.formatUnits(allowance, decimals);
    } catch (error) {
      console.error("Error checking allowance:", error);
      return "0";
    }
  }

  async loadApprovals(
    address: string,
    contracts: any,
    walletProvider: any,
    chainId: number
  ): Promise<ContractSection[]> {
    if (!address || !contracts || !walletProvider || !chainId) return [];

    const contractConfig = [
      { key: "consensusFactory", title: "Consensus connection factory contract" },
      { key: "prNodeStake", title: "PR node stake contract" },
      { key: "privateContract", title: "Private contract" }
    ];

    const newSections: ContractSection[] = [];
    const tokenList = this.getTokenList(chainId);

    for (const config of contractConfig) {
      const contractAddress = contracts[config.key as keyof typeof contracts];
      const tokens: TokenApproval[] = [];

      if (contractAddress && tokenList.length > 0) {
        for (const token of tokenList) {
          try {
            const allowance = await this.checkAllowance(
              token.address,
              contractAddress,
              token.decimals,
              address,
              walletProvider
            );

            const allowanceNum = parseFloat(allowance);
            if (allowanceNum > 0) {
              tokens.push({ ...token, allowance, spender: contractAddress });
            }
          } catch (error) {
            console.error(`Error checking ${token.symbol} allowance:`, error);
          }
        }
      }

      newSections.push({
        title: config.title,
        address: contractAddress as string | undefined,
        tokens,
        expanded: tokens.length > 0
      });
    }

    return newSections;
  }

  async revokeApproval(
    tokenAddress: string,
    spenderAddress: string,
    walletProvider: any,
    address: string
  ): Promise<void> {
    if (!walletProvider || !address) {
      throw new Error("Wallet not connected");
    }

    try {
      const data = '0x095ea7b3' +
        spenderAddress.slice(2).toLowerCase().padStart(64, '0') +
        '0'.padStart(64, '0');

      const txHash = await walletProvider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: tokenAddress,
          data,
          gas: '0x15f90'
        }]
      });

      for (let i = 0; i < 60; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const receipt = await walletProvider.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        });

        if (receipt) {
          if (receipt.status === '0x0') {
            throw new Error('Revoke approval transaction failed');
          }
          console.log('Approval revoked successfully:', txHash);
          return;
        }
      }

      throw new Error('Revoke approval timeout');
    } catch (error: any) {
      console.error('Revoke approval error:', error);
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        throw new Error('Transaction rejected by user');
      }
      throw error;
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// RecoveryPlanService
// ─────────────────────────────────────────────────────────────────────────────
export class RecoveryPlanService {

  private formatEther(value: bigint): string {
    return this.formatUnits(value, 18);
  }

  private formatUnits(value: bigint, decimals: number): string {
    const valueStr = value.toString();
    const isNegative = valueStr.startsWith('-');
    const absoluteValue = isNegative ? valueStr.slice(1) : valueStr;

    if (decimals === 0) return absoluteValue;

    const paddedValue = absoluteValue.padStart(decimals + 1, '0');
    const integerPart = paddedValue.slice(0, -decimals) || '0';
    const decimalPart = paddedValue.slice(-decimals);

    const trimmedDecimal = decimalPart.replace(/0+$/, '');

    if (trimmedDecimal === '') {
      return (isNegative ? '-' : '') + integerPart;
    }

    return (isNegative ? '-' : '') + integerPart + '.' + trimmedDecimal;
  }

  private async rpcCall(rpcUrl: string, method: string, params: any[]): Promise<any> {
    const response = await fetch(rpcUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method,
        params,
      }),
    });

    const data = await response.json();

    if (data.error) {
      throw new Error(data.error.message || 'RPC call failed');
    }

    return data.result;
  }

  private decodeEventData(data: string): { address: string; amount: bigint } {
    const hexData = data.startsWith('0x') ? data.slice(2) : data;

    const addressHex = hexData.slice(24, 64);
    const address = '0x' + addressHex;

    const amountHex = hexData.slice(64, 128);
    const amount = BigInt('0x' + amountHex);

    return { address, amount };
  }

  async getRecoveryPotBalance(chainId: number): Promise<string> {
    try {
      const RECOVER_FUND_ADDRESS = import.meta.env.VITE_POT_WALLET;
      if (!RECOVER_FUND_ADDRESS) return "0";

      const { getChainById } = await import("../../config/chains");
      const chain = getChainById(chainId);
      if (!chain) return "0";

      const data = '0xb69ef8a8';

      const result = await this.rpcCall(
        chain.rpcUrl,
        'eth_call',
        [
          {
            to: RECOVER_FUND_ADDRESS,
            data,
          },
          'latest',
        ]
      );

      const balance = BigInt(result);
      return this.formatEther(balance);
    } catch (error) {
      console.error("Error fetching balance:", error);
      return "0";
    }
  }

  async getRecoveryTransactions(userAddress: string, chainId: number): Promise<RecoveryTransaction[]> {
    try {
      const RECOVER_FUND_ADDRESS = import.meta.env.VITE_POT_WALLET;
      const BSC_API_URL = import.meta.env.VITE_BSC_API_URL;
      const BSC_API_KEY = import.meta.env.VITE_BSC_API_KEY;
      const INVEST_EVENT = import.meta.env.VITE_INVEST_EVENT;

      if (!RECOVER_FUND_ADDRESS || !BSC_API_URL || !BSC_API_KEY || !INVEST_EVENT) return [];

      const url = `${BSC_API_URL}?module=logs&action=getLogs&fromBlock=0&toBlock=latest&address=${RECOVER_FUND_ADDRESS}&apikey=${BSC_API_KEY}`;
      const response = await axios.get(url);
      const eventLog = response.data.result;

      if (!eventLog || !Array.isArray(eventLog)) return [];

      const array: RecoveryTransaction[] = [];

      for (let i = 0; i < eventLog.length; i++) {
        const temp = eventLog[i];

        if (temp.topics[0] === INVEST_EVENT) {
          const decoded = this.decodeEventData(temp.data);

          if (decoded.address.toLowerCase() === userAddress.toLowerCase()) {
            const date = new Date(parseInt(temp.timeStamp) * 1000);
            const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;

            array.push({
              createTime: formattedDate,
              lockAmount: this.formatEther(decoded.amount),
              lockCurrency: "USDC",
              hash: temp.transactionHash,
            });
          }
        }
      }

      return array;
    } catch (error) {
      console.error("Error fetching event logs:", error);
      return [];
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// AGFGameProposalService
// ─────────────────────────────────────────────────────────────────────────────
export class AGFGameProposalService {

  private getHeaders() {
    const loginToken = localStorage.getItem('atm_token');
    return getAGFHeaders(loginToken);
  }

  async getProposalByUserId(): Promise<AGFProposalResponse> {
    try {
      const apiUrl = urls.agf.getProposal();
      const data = { userId: 'userId' };

      const response = await axios.post(apiUrl, data, {
        withCredentials: true,
        headers: this.getHeaders(),
      });

      return {
        success: response.data.success || false,
        isSuccess: response.data.success || false,
        data: response.data.data || [],
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error fetching user proposals:', error);
      return {
        success: false,
        isSuccess: false,
        data: [],
        message: 'Failed to fetch proposals',
      };
    }
  }

  async getAdminProposal(): Promise<AGFProposalResponse> {
    try {
      const apiUrl = urls.agf.getAllProposal();
      const data = { blank: 'blank' };

      const response = await axios.post(apiUrl, data, {
        withCredentials: true,
        headers: this.getHeaders(),
      });

      return {
        success: response.data.success || false,
        isSuccess: response.data.success || false,
        data: response.data.data || [],
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error fetching admin proposals:', error);
      return {
        success: false,
        isSuccess: false,
        data: [],
        message: 'Failed to fetch admin proposals',
      };
    }
  }

  async updateProposalByAdmin(dataObject: any): Promise<{ success: boolean; isSuccess: boolean; data: any; message?: string }> {
    try {
      const apiUrl = urls.agf.updateGameStatus();

      const response = await axios.post(apiUrl, dataObject, {
        withCredentials: true,
        headers: this.getHeaders(),
      });

      return {
        success: response.data.success || false,
        isSuccess: response.data.success || false,
        data: response.data.data || '',
        message: response.data.message,
      };
    } catch (error) {
      console.error('Error updating proposal:', error);
      return {
        success: false,
        isSuccess: false,
        data: '',
        message: 'Failed to update proposal',
      };
    }
  }

  async createProposal(data: any): Promise<{ success: boolean; isSuccess: boolean; message: string }> {
    try {
      const apiUrl = urls.agf.createProposal();

      const response = await axios.post(apiUrl, data, {
        withCredentials: true,
        headers: this.getHeaders(),
      });

      return {
        success: response.data.success || false,
        isSuccess: response.data.success || false,
        message: response.data.data || response.data.message || '',
      };
    } catch (error) {
      console.error('Error creating proposal:', error);
      return {
        success: false,
        isSuccess: false,
        message: 'Failed to create proposal',
      };
    }
  }

  async updateProposal(data: any): Promise<{ success: boolean; isSuccess: boolean; message: string }> {
    try {
      const apiUrl = urls.agf.updateProposal();

      const response = await axios.post(apiUrl, data, {
        withCredentials: true,
        headers: this.getHeaders(),
      });

      return {
        success: response.data.success || false,
        isSuccess: response.data.success || false,
        message: response.data.data || response.data.message || '',
      };
    } catch (error) {
      console.error('Error updating proposal:', error);
      return {
        success: false,
        isSuccess: false,
        message: 'Failed to update proposal',
      };
    }
  }

  unwrapAGFProposal(data: AGFGameProposal): void {
    try {
      const emailDetails = data.contactDetails.find(
        (contact) => contact.name === "email"
      );

      const contactDetailsSocialPlatform = data.contactDetails
        .filter((contact) => contact.name !== "email")
        .map((contact) => ({
          platform: contact.name || "Not found",
          link: contact.description || "Not found",
          images: contact.images || "Not found",
        }));

      const gameConcept = {
        id: data.id || "",
        title: data.title || "",
        overview: data.overview || "",
        gamePlay: data.gameplay || "",
        notes: data.notes || "",
        createdBy: data.createdBy || "",
      };

      let connectionObj;
      try {
        connectionObj = JSON.parse(data.connectionDetails);
      } catch (e) {
        connectionObj = { lucaLock: "", days: "" };
      }

      const connectionDetails = {
        amountOfLUCA: connectionObj.lucaLock || "",
        numberOfDays: connectionObj.days || "",
      };

      const milestones = data.milestones.map((milestone) => ({
        id: milestone.id || "",
        milestoneTitle: milestone.title || "",
        milestoneDescription: milestone.description || "",
        milestoneTimeDuration: milestone.deadline || "",
        milestoneFundNeeded: milestone.funds.toString() || "0.00",
      }));

      const imagesArray: any[] = [];
      const videoArray: any[] = [];

      data.gamesMediaModelList.forEach((media) => {
        if (media.type === 1) {
          imagesArray.push(media);
        } else if (media.type === 2) {
          videoArray.push(media);
        }
      });

      const categories = data.gameCategoriesModelList.map((item) =>
        item.categoryId.toString()
      );

      const contactData = {
        email: emailDetails?.description || "",
        socialPlatform: contactDetailsSocialPlatform,
      };

      localStorage.setItem("imagesArray", JSON.stringify(imagesArray));
      localStorage.setItem("videoArray", JSON.stringify(videoArray));
      localStorage.setItem("gameConcept", JSON.stringify(gameConcept));
      localStorage.setItem("connectionDetails", JSON.stringify(connectionDetails));
      localStorage.setItem("contactDetails", JSON.stringify(contactData));
      localStorage.setItem("milestones", JSON.stringify(milestones));
      localStorage.setItem("selectedCategories", JSON.stringify(categories));
    } catch (error) {
      console.error("Error unwrapping AGF proposal:", error);
    }
  }

  wrapAGFProposal(isEdit: boolean = false): any {
    try {
      const imagesArray = JSON.parse(localStorage.getItem('imagesArray') || '[]');
      const videoArray = JSON.parse(localStorage.getItem('videoArray') || '[]');
      const gameConcept = JSON.parse(localStorage.getItem('gameConcept') || '{}');
      const connectionDetails = JSON.parse(localStorage.getItem('connectionDetails') || '{}');
      const contactDetails = JSON.parse(localStorage.getItem('contactDetails') || '{}');
      const milestones = JSON.parse(localStorage.getItem('milestones') || '[]');
      const categories = JSON.parse(localStorage.getItem('selectedCategories') || '[]');

      const totalFundsNeeded = milestones.reduce((total: number, milestone: any) => {
        return total + (parseFloat(milestone.milestoneFundNeeded) || 0.00);
      }, 0.00);

      const filteredImagesArray = imagesArray.filter((image: any) => image.link !== '');
      const combinedArray = [...filteredImagesArray, ...videoArray];

      const gamesMediaModelList = combinedArray
        .filter((item: any) => item.link)
        .map((item: any) => ({
          ...item,
          link: this.ensureValidUrl(item.link)
        }));

      const allContactDetails = [...(contactDetails.socialPlatform || [])];
      if (contactDetails.email) {
        allContactDetails.push({
          platform: 'email',
          description: contactDetails.email,
          link: contactDetails.email
        });
      }

      const data: any = {
        title: gameConcept.title || "Not found",
        overview: gameConcept.overview || "Not found",
        gameplay: gameConcept.gamePlay || "Not found",
        gamePlay: gameConcept.gamePlay || "Not found",
        connectionDetails: JSON.stringify({
          lucaLock: connectionDetails.amountOfLUCA || "Not found",
          days: connectionDetails.numberOfDays || "Not found"
        }),
        funds: totalFundsNeeded,
        status: 1,
        categoriesIds: categories,
        contactDetails: allContactDetails.map((contact: any) => ({
          name: contact.platform || "Not found",
          description: contact.link || "Not found",
          images: contact.images || "Not found",
          link: contact.link || "Not found",
        })),
        milestones: milestones.map((milestone: any) => ({
          title: milestone.milestoneTitle || "Not found",
          description: milestone.milestoneDescription || "Not found",
          deadline: milestone.milestoneTimeDuration || "Not found",
          funds: parseFloat(milestone.milestoneFundNeeded) || 0.00,
        })),
        gamesMediaModelList,
      };

      if (isEdit) {
        data.id = gameConcept.id;
        data.createdBy = gameConcept.createdBy;
      }

      return data;
    } catch (error) {
      console.error("Error wrapping AGF proposal:", error);
      throw error;
    }
  }

  private ensureValidUrl(url: string): string {
    try {
      new URL(url);
      return url;
    } catch {
      return '';
    }
  }

  clearProposalData(): void {
    localStorage.removeItem('imagesArray');
    localStorage.removeItem('videoArray');
    localStorage.removeItem('gameConcept');
    localStorage.removeItem('connectionDetails');
    localStorage.removeItem('contactDetails');
    localStorage.removeItem('milestones');
    localStorage.removeItem('selectedCategories');
    localStorage.removeItem('selectedGameProposal');
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// LinkConnectionService
// ─────────────────────────────────────────────────────────────────────────────
export class LinkConnectionService {
  private authService: AuthenticationService;

  constructor(authService: AuthenticationService) {
    this.authService = authService;
  }

  async fetchConnectionById(id: string, isNFT: boolean): Promise<any> {
    try {
      const endpoint = isNFT ? '/nft/nftLinkById' : '/site/linkById';
      const params = new URLSearchParams();
      params.append('id', id);

      const requestOptions: RequestInit = {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params,
      };

      const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}${endpoint}`, requestOptions);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success && result.data?.linkRecord) {
        return result.data.linkRecord;
      }

      return null;
    } catch (error) {
      console.error('Error fetching connection:', error);
      throw error;
    }
  }

  async fetchNFTMetadata(nftAddress: string, tokenId: string): Promise<any> {
    try {
      const response = await fetch(urls.nft.metadata(nftAddress, tokenId));
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch metadata for token ${tokenId}:`, error);
      return null;
    }
  }

  async agreeConnection(
    linkAddress: string,
    tokenId: string | undefined,
    walletProvider: any
  ): Promise<{ success: boolean; message?: string; hash?: string }> {
    if (!walletProvider) {
      throw new Error('Wallet provider required');
    }

    try {
      const address = this.authService.getUserAddress();
      if (!address) throw new Error('User address not set');

      let data: string;

      if (tokenId) {
        data = '0xf6cd35ee' + BigInt(tokenId).toString(16).padStart(64, '0');
      } else {
        data = '0xc68910eb';
      }

      const txHash = await walletProvider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: linkAddress,
          data,
          gas: '0x15f90'
        }]
      });

      for (let i = 0; i < 60; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const receipt = await walletProvider.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        });

        if (receipt) {
          if (receipt.status === '0x0') {
            throw new Error('Transaction failed');
          }
          return { success: true, hash: txHash };
        }
      }

      throw new Error('Transaction timeout');
    } catch (error: any) {
      console.error('Agree error:', error);
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        return { success: false, message: 'Transaction rejected by user' };
      }
      return { success: false, message: error.message || 'Failed to agree' };
    }
  }

  async cancelConnection(
    linkAddress: string,
    walletProvider: any
  ): Promise<{ success: boolean; message?: string; hash?: string }> {
    if (!walletProvider) {
      throw new Error('Wallet provider required');
    }

    try {
      const address = this.authService.getUserAddress();
      if (!address) throw new Error('User address not set');

      const data = '0xea8a1af0';

      const txHash = await walletProvider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: linkAddress,
          data,
          gas: '0x15f90'
        }]
      });

      for (let i = 0; i < 60; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const receipt = await walletProvider.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        });

        if (receipt) {
          if (receipt.status === '0x0') {
            throw new Error('Transaction failed');
          }
          return { success: true, hash: txHash };
        }
      }

      throw new Error('Transaction timeout');
    } catch (error: any) {
      console.error('Cancel error:', error);
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        return { success: false, message: 'Transaction rejected by user' };
      }
      return { success: false, message: error.message || 'Failed to cancel' };
    }
  }

  async rejectConnection(
    linkAddress: string,
    walletProvider: any
  ): Promise<{ success: boolean; message?: string; hash?: string }> {
    if (!walletProvider) {
      throw new Error('Wallet provider required');
    }

    try {
      const address = this.authService.getUserAddress();
      if (!address) throw new Error('User address not set');

      const data = '0x97aba7f9';

      const txHash = await walletProvider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: linkAddress,
          data,
          gas: '0x15f90'
        }]
      });

      for (let i = 0; i < 60; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const receipt = await walletProvider.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        });

        if (receipt) {
          if (receipt.status === '0x0') {
            throw new Error('Transaction failed');
          }
          return { success: true, hash: txHash };
        }
      }

      throw new Error('Transaction timeout');
    } catch (error: any) {
      console.error('Reject error:', error);
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        return { success: false, message: 'Transaction rejected by user' };
      }
      return { success: false, message: error.message || 'Failed to reject' };
    }
  }

  async closeConnection(
    linkAddress: string,
    walletProvider: any
  ): Promise<{ success: boolean; message?: string; hash?: string }> {
    if (!walletProvider) {
      throw new Error('Wallet provider required');
    }

    try {
      const address = this.authService.getUserAddress();
      if (!address) throw new Error('User address not set');

      const data = '0x43d726d6';

      const txHash = await walletProvider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: linkAddress,
          data,
          gas: '0x15f90'
        }]
      });

      for (let i = 0; i < 60; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const receipt = await walletProvider.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        });

        if (receipt) {
          if (receipt.status === '0x0') {
            throw new Error('Transaction failed');
          }
          return { success: true, hash: txHash };
        }
      }

      throw new Error('Transaction timeout');
    } catch (error: any) {
      console.error('Close error:', error);
      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        return { success: false, message: 'Transaction rejected by user' };
      }
      return { success: false, message: error.message || 'Failed to close' };
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CrosschainService
// ─────────────────────────────────────────────────────────────────────────────
export class CrosschainService {

  private parseUnits(amount: string, decimals: number = 18): bigint {
    const [integerPart, decimalPart = ''] = amount.split('.');

    const paddedDecimal = decimalPart.padEnd(decimals, '0').slice(0, decimals);

    const combined = integerPart + paddedDecimal;
    return BigInt(combined);
  }

  private encodeString(str: string): string {
    const hex = str.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');

    const length = str.length.toString(16).padStart(64, '0');

    const paddedHex = hex.padEnd(Math.ceil(hex.length / 64) * 64, '0');

    return length + paddedHex;
  }

  async executeCrosschainTransfer(params: {
    amount: string;
    destinationChain: string;
    receivingAddress: string;
    selectedToken: string;
    crosschainAddress: string;
    tokenAddress: string;
    userAddress: string;
    walletProvider: any;
  }): Promise<CrosschainTransferResult> {
    const {
      amount,
      destinationChain,
      receivingAddress,
      selectedToken,
      crosschainAddress,
      tokenAddress,
      userAddress,
      walletProvider
    } = params;

    if (!walletProvider) {
      return {
        success: false,
        error: 'Wallet provider not available'
      };
    }

    try {
      const amountWei = this.parseUnits(amount, 18);

      console.log('Checking allowance...');
      const allowanceData = '0xdd62ed3e' +
        userAddress.slice(2).toLowerCase().padStart(64, '0') +
        crosschainAddress.slice(2).toLowerCase().padStart(64, '0');

      const allowanceResult = await walletProvider.request({
        method: 'eth_call',
        params: [{ to: tokenAddress, data: allowanceData }, 'latest']
      });

      const allowance = BigInt(allowanceResult);

      if (allowance < amountWei) {
        console.log('Requesting approval...');

        const approveData = '0x095ea7b3' +
          crosschainAddress.slice(2).toLowerCase().padStart(64, '0') +
          amountWei.toString(16).padStart(64, '0');

        const approveTxHash = await walletProvider.request({
          method: 'eth_sendTransaction',
          params: [{
            from: userAddress,
            to: tokenAddress,
            data: approveData,
            gas: '0x15f90'
          }]
        });

        console.log('Waiting for approval confirmation...');
        for (let i = 0; i < 60; i++) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          const receipt = await walletProvider.request({
            method: 'eth_getTransactionReceipt',
            params: [approveTxHash]
          });

          if (receipt) {
            if (receipt.status === '0x0') {
              throw new Error('Approval transaction failed');
            }
            console.log('Approval confirmed');
            break;
          }
        }
      }

      const chainNameMap: { [key: string]: string } = {
        bsc: 'Binance',
        ethereum: 'Ethereum',
        polygon: 'Polygon',
        arbitrum: 'Arbitrum',
        optimism: 'Optimism'
      };
      const mappedChain = chainNameMap[destinationChain] || destinationChain;

      console.log('Initiating cross-chain transfer...');

      const functionSelector = '0x7f8c99b5';

      const staticParamsSize = 4 * 32;
      const stringOffset = staticParamsSize.toString(16).padStart(64, '0');

      const toAddressParam = receivingAddress.slice(2).toLowerCase().padStart(64, '0');
      const tokenAddressParam = tokenAddress.slice(2).toLowerCase().padStart(64, '0');
      const amountParam = amountWei.toString(16).padStart(64, '0');

      const stringData = this.encodeString(mappedChain);

      const data = functionSelector +
        stringOffset +
        toAddressParam +
        tokenAddressParam +
        amountParam +
        stringData;

      const txHash = await walletProvider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: userAddress,
          to: crosschainAddress,
          data,
          gas: '0xc3500'
        }]
      });

      console.log('Transaction hash:', txHash);

      console.log('Waiting for confirmation...');
      for (let i = 0; i < 60; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const receipt = await walletProvider.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        });

        if (receipt) {
          if (receipt.status === '0x0') {
            throw new Error('Transaction failed');
          }
          console.log('Transaction confirmed:', receipt);
          return {
            success: true,
            txHash,
            receipt
          };
        }
      }

      throw new Error('Transaction timeout');

    } catch (error: any) {
      console.error('Crosschain transfer error:', error);

      if (error.code === 4001 || error.code === 'ACTION_REJECTED') {
        return {
          success: false,
          error: 'Transaction cancelled by user'
        };
      }

      if (error.code === -32603) {
        return {
          success: false,
          error: 'Transaction failed: Internal JSON-RPC error. Please check your balance and try again.'
        };
      }

      return {
        success: false,
        error: error.reason || error.message || 'Unknown error occurred'
      };
    }
  }
}
