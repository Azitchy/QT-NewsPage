import axios from 'axios';

const isDevelopment = import.meta.env.DEV;

export const API_CONFIG = {
  OPENAPI_BASE_URL: isDevelopment ? '/openapi' : import.meta.env.VITE_OPENAPI_BASE_URL,
  WEB_API_BASE_URL: isDevelopment ? '/api' : import.meta.env.VITE_WEB_API_BASE_URL,
  GAME_API_BASE_URL: isDevelopment ? '/gameapi' : import.meta.env.VITE_GAME_API_BASE_URL,
  API_TOKEN: import.meta.env.VITE_API_TOKEN,
  CLIENT_TYPE: parseInt(import.meta.env.VITE_CLIENT_TYPE || '6'),
  CLIENT_VERSION: parseInt(import.meta.env.VITE_CLIENT_VERSION || '1'),
  DEVICE_ID: parseInt(import.meta.env.VITE_DEVICE_ID || '112233'),
  SESSION_DURATION: parseInt(import.meta.env.VITE_SESSION_DURATION || '86400000'),
  DEFAULT_LANGUAGE: import.meta.env.VITE_DEFAULT_LANGUAGE || 'en',
} as const;

const ENCRYPTION_KEY_STORAGE = 'atm_enc_key';
const CACHE_PREFIX = 'atm_cache_';
const CACHE_TTL = 86400000;
const SIGNATURE_CACHE_KEY = 'atm_withdrawal_signatures_cache';
const SIGNATURE_CACHE_DURATION = 10 * 60 * 1000;
const USE_CACHED_SIGNATURES = 1;

const shouldUseCredentials = () => !isDevelopment;

/* ============================================================================
   TYPE DEFINITIONS
   ============================================================================ */

export interface AuthTokenData {
  loginToken: string;
  tokenExpiry: number;
  userAddress: string;
}

export interface SignatureCache {
  signs: string[];
  expected_expiration: number;
  code: string;
  timestamp: number;
  userAddress: string;
}

export interface WithdrawalResult {
  success: boolean;
  transactionHash?: string;
  error?: string;
}

export interface Proposal {
  id: string;
  title: string;
  status: number;
  startTime?: number;
  endTime?: number;
  createTime: number;
  typeOfProposal?: string;
  redeemFlag?: number;
  creatorUserDetailsModel?: {
    walletAddress: string;
  };
}

export interface ProposalListResponse {
  success: boolean;
  data: {
    initiateList: Proposal[];
    totalCount: number;
  };
}

export interface LinkConnection {
  id: number;
  createAddress: string;
  targetAddress: string;
  linkAddress: string;
  createBalance: number;
  targetBalance: number;
  linkCurrency: string;
  lockedDay: number;
  linkStatus: number;
  redeemStatus?: number;
  createTime?: number;
  unlockedTime?: string;
  chainId?: number;
}

export interface ConsensusConnection {
  id: number;
  newNodeAddress: string;
  serverNickname: string;
  amount: number;
  myAmount: number;
  stackThisYear: number;
  userStakingLimit: number;
  remainingStakingAmount: number;
  ledgeType?: string;
  status?: number;
}

export interface IncomeRecord {
  date: string;
  pr: number;
  topNodes: number;
  pledge: number;
  liquidity: number;
  user_id: string;
}

export interface WithdrawalRecord {
  get_time: string;
  total_amount: number;
  transaction_hash: string;
  coin_type: string;
  in_time: string;
  user_id: string;
}

export interface JoinATMFormData {
  projectName: string;
  projectToken?: string;
  lucaCommunity: 'YES' | 'NO';
  lucaCandyValue?: string;
  projectLink: string;
  email: string;
  teamSupport: string;
  contractPlatform: string;
  whiteBookLink?: string;
  projectMedia?: string;
  projectIntroduction: string;
  attachment?: File;
}

export interface GameProposal {
  id?: string;
  userId?: string;
  title: string;
  description: string;
  category: string;
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: string;
  updatedAt?: string;
}

export interface Game {
  id: string;
  title: string;
  description: string;
  category: string;
  rating?: number;
  totalRatings?: number;
  totalInvestment?: number;
  status: 'active' | 'inactive' | 'development';
  createdAt: string;
  updatedAt: string;
}

export interface GameRating {
  gameId: string;
  rating: number;
  userId?: string;
  comment?: string;
}

export interface GameInvestment {
  gameId: string;
  amount: number;
  userId: string;
}

export interface BattleData {
  gameId: number;
  userGameInfoList: Array<{
    agfUserId: number;
    gameLevel: number;
    star: number;
  }>;
  details?: string;
}

export interface UpdateBattleData {
  battleId: number;
  gameId: number;
  userGameInfoList: Array<{
    agfUserId: number;
    gameLevel: number;
    star: number;
  }>;
}

export interface UserStarsData {
  agfUserId: number;
}

export interface NewsItem {
  id: string;
  title: string;
  content: string;
  coverImg: string;
  type: number;
  createdAt: string;
  updatedAt: string;
}

export interface NewsListResponse {
  success: boolean;
  data: {
    newsList: NewsItem[];
    totalCount: number;
  };
}

export interface OverviewData {
  price: number;
  pre: string;
  issuanceTotal: number;
  circulationTotal: number;
  contractTotalAmount: number;
  liquidityReward: number;
  communityFundStock: number;
  treatyTotal: number;
  contractCount: number;
  prCount: number;
}

export interface CoinCurrency {
  id: number;
  currencyKey: string;
  currencyName: string;
  currencyLogo: string;
  contractAddress: string;
  chainId: number;
  nowPrice: number;
  baseCurrency: string;
  tradeCurrency: string;
  status: number;
  gateWay: string;
  weiPlaces: string;
  aloneCalculateFlag?: number;
  lockAmount?: number;
  pricePlaces?: number;
  [key: string]: any;
}

export interface PRNodeItem {
  serverAddress: string;
  serverUrl: string;
  serverIp: string;
  serverNickname: string;
  ledgeAmount: string;
  rank?: number;
}

export interface StakeTransactionItem {
  hash: string;
  userAddress: string;
  serverAddress: string;
  ledgeAmount: string;
  createTime: string;
  chainNetWork: string;
  ledgeType: number;
  rank?: number;
}

export interface ContractInfoItem {
  name: string;
  nameEn: string;
  address: string;
  transactions: number;
  balance: string;
  lastBlock: string;
  type: number;
}

export interface RankingItem {
  rank: number;
  address: string;
  totalAmount: number;
}

export interface NFTProject {
  id: number;
  name: string;
  address: string;
  webUrl: string;
  status: number;
  chainId?: number;
}

export interface NFTLinkConnection {
  id: number;
  createAddress: string;
  targetAddress: string;
  linkAddress: string;
  createLockNft: string;
  targetLockNft: string;
  nftAddress: string;
  nftName: string;
  lockedDay: number;
  lockFlag: number;
  linkStatus: number;
  redeemStatus?: number;
  createTime?: number;
  unlockedTime?: string;
  chainId?: number;
  remainDay?: number;
  createHash?: string;
  myNft?: string;
  myNft2?: string;
  targetNft?: string;
  targetNft2?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  walletAddress?: string;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  isSuccess?: boolean;
  errorcode?: string;
  failed?: boolean;
  mapData?: any;
  msg?: string;
  state?: string;
  status?: string;
  total?: number;
}

export interface AGFGameProposal {
  id?: string;
  title: string;
  overview: string;
  gameplay: string;
  notes?: string;
  connectionDetails: string;
  funds: number;
  status: number;
  typeOfProposal: string;
  createTime?: number;
  createdBy?: string;
  startTime?: number;
  endTime?: number;
  redeemFlag?: number;
  contactDetails: Array<{
    name: string;
    description: string;
    images?: string;
    link?: string;
  }>;
  milestones: Array<{
    id?: string;
    title: string;
    description: string;
    deadline: string;
    funds: number;
  }>;
  gamesMediaModelList: Array<{
    type: number;
    link: string;
  }>;
  gameCategoriesModelList: Array<{
    categoryId: number;
  }>;
  creatorUserDetailsModel?: {
    walletAddress: string;
  };
}

export interface AGFProposalResponse {
  success: boolean;
  isSuccess: boolean;
  data: AGFGameProposal[] | string;
  message?: string;
}

export interface CrosschainTransferResult {
  success: boolean;
  txHash?: string;
  error?: string;
  receipt?: any;
}

/* ============================================================================
   ENCRYPTION & CACHING
   ============================================================================ */

class EncryptionService {
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

/* ============================================================================
   AUTHENTICATION SERVICE - REOWN
   ============================================================================ */

class AuthenticationService {
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

    console.log('[API] Requesting sign message for address:', this.userAddress);

    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cssg-Language': API_CONFIG.DEFAULT_LANGUAGE,
    };
    if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

    console.log('[API] Request headers:', headers);

    const response = await axios.get(`${API_CONFIG.OPENAPI_BASE_URL}/open/getSignMessage`, {
      headers,
      params: { address: this.userAddress },
    });

    console.log('[API] Sign message response:', response.data);
    console.log('[API] Response structure:', {
      hasData: !!response.data,
      hasDataData: !!response.data?.data,
      hasSignMessage: !!response.data?.signMessage,
      dataDataSignMessage: response.data?.data?.signMessage,
      dataSignMessage: response.data?.signMessage,
      dataData: response.data?.data
    });

    const signMessage = response.data?.data?.signMessage || response.data?.signMessage || response.data?.data;

    console.log('[API] Extracted sign message:', signMessage);
    console.log('[API] Sign message type:', typeof signMessage);

    if (!signMessage || typeof signMessage !== 'string') {
      console.error('[API] Invalid sign message response - Full response:', JSON.stringify(response.data, null, 2));
      throw new Error('Invalid sign message response');
    }

    console.log('[API] Sign message retrieved successfully');
    return signMessage;
  }

  /**
   * Sign message using Reown EIP-1193 provider
   */
  async signMessage(message: string, walletProvider: any): Promise<string> {
    if (!this.userAddress) throw new Error('User address not set');
    if (!walletProvider) throw new Error('Wallet provider not available');

    try {
      const signature = await walletProvider.request({
        method: 'personal_sign',
        params: [message, this.userAddress],
      });
      return signature;
    } catch (error: any) {
      console.error('Error signing message:', error);
      throw new Error(error?.message || 'Failed to sign message');
    }
  }

  async getLoginToken(signature: string): Promise<string> {
    if (!this.userAddress) throw new Error('User address not set');

    const headers: Record<string, string> = {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Cssg-Language': API_CONFIG.DEFAULT_LANGUAGE,
    };
    if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

    const response = await axios.get(`${API_CONFIG.OPENAPI_BASE_URL}/open/getLoginToken`, {
      headers,
      params: {
        address: this.userAddress,
        sign: signature,
        deviceId: API_CONFIG.DEVICE_ID.toString(),
        clientType: API_CONFIG.CLIENT_TYPE.toString(),
        clientVersion: API_CONFIG.CLIENT_VERSION.toString(),
      },
      withCredentials: true,
    });

    const token = response.data?.data?.loginToken || response.data?.data?.token || response.data?.loginToken || response.data?.token ||
      (typeof response.data?.data === 'string' && response.data.data.length > 10 ? response.data.data : null);

    if (!token) throw new Error('Invalid login response - no token found');

    this.loginToken = token;
    this.tokenExpiry = Date.now() + (24 * 60 * 60 * 1000);
    localStorage.setItem('atm_token', token);
    localStorage.setItem('atm_token_expiry', this.tokenExpiry.toString());

    return token;
  }

  getCookie(): string | null {
    return document.cookie;
  }

  async authenticate(walletProvider: any): Promise<string> {
    if (this.authPromise) return this.authPromise;
    if (this.isTokenValid() && this.loginToken) return this.loginToken;

    this.authPromise = (async () => {
      try {
        const message = await this.getSignMessage();
        const signature = await this.signMessage(message, walletProvider);
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

    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Cssg-Language': API_CONFIG.DEFAULT_LANGUAGE,
      'token': token,
    };
    if (cookie) headers['Cookie'] = cookie;
    if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

    return headers;
  }
}

/* ============================================================================
   WITHDRAWAL SERVICE 
   ============================================================================ */

class WithdrawalService {
  private balanceCache: { amount: number; timestamp: number } | null = null;
  private readonly BALANCE_CACHE_DURATION = 30000;

  // Keep all existing cache and helper methods unchanged
  private saveSigaturesToCache(signatures: { signs: string[]; expected_expiration: number; code: string }, userAddress: string): void {
    try {
      const cache: SignatureCache = { ...signatures, timestamp: Date.now(), userAddress };
      localStorage.setItem(SIGNATURE_CACHE_KEY, JSON.stringify(cache));
    } catch (error) { }
  }

  private loadSignaturesFromCache(userAddress: string): { signs: string[]; expected_expiration: number; code: string } | null {
    try {
      const cached = localStorage.getItem(SIGNATURE_CACHE_KEY);
      if (!cached) return null;
      const cache: SignatureCache = JSON.parse(cached);
      if (cache.userAddress !== userAddress) return null;
      if (Date.now() - cache.timestamp > SIGNATURE_CACHE_DURATION) return null;
      if (Math.floor(Date.now() / 1000) >= cache.expected_expiration) return null;
      return { signs: cache.signs, expected_expiration: cache.expected_expiration, code: cache.code };
    } catch (error) {
      return null;
    }
  }

  private clearSignatureCache(): void {
    try {
      localStorage.removeItem(SIGNATURE_CACHE_KEY);
    } catch (error) { }
  }

  clearBalanceCache() {
    this.balanceCache = null;
  }

  async getWithdrawalBalance(walletProvider?: any): Promise<number> {
    if (this.balanceCache && Date.now() - this.balanceCache.timestamp < this.BALANCE_CACHE_DURATION) {
      return this.balanceCache.amount;
    }

    try {
      const token = await authService.getToken(walletProvider);
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'token': token,
        'Cssg-Language': API_CONFIG.DEFAULT_LANGUAGE,
      };
      if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

      const response = await axios.get(`${API_CONFIG.OPENAPI_BASE_URL}/open/getCurrentIncome`, {
        headers,
        ...(shouldUseCredentials() && { withCredentials: true }),
      });

      if (response.data?.errorcode === 'NOT_LOGGEDIN' || response.data?.failed) {
        // Clear stale auth and force re-authentication
        authService.clearAuth();
        const newToken = await authService.authenticate(walletProvider);
        headers['token'] = newToken;
        const retryResponse = await axios.get(`${API_CONFIG.OPENAPI_BASE_URL}/open/getCurrentIncome`, {
          headers,
          ...(shouldUseCredentials() && { withCredentials: true }),
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
    const config: any = {
      headers: { 'Content-Type': 'application/json', 'Cssg-Language': API_CONFIG.DEFAULT_LANGUAGE, 'token': token },
    };
    if (!isDevelopment) config.headers['apiToken'] = API_CONFIG.API_TOKEN;
    if (shouldUseCredentials()) config.withCredentials = true;

    const response = await axios.get(`${API_CONFIG.OPENAPI_BASE_URL}/open/getServerList`, config);
    if (response.data?.errorcode === 'NOT_LOGGEDIN' || response.data?.failed) {
      throw new Error('Authentication required for server list');
    }
    if (!response.data?.data?.serverList) throw new Error('Invalid server list response');
    return response.data.data;
  }

  private async getPRSignature(serverUrl: string, userAddress: string, amount: number): Promise<{ sign: string; expected_expiration: number; code: string } | null> {
    try {
      const token = localStorage.getItem('atm_token');
      console.log(`[PR Signature] Requesting from: ${serverUrl}`);
      console.log(`[PR Signature] Token exists: ${!!token}`);
      console.log(`[PR Signature] UserAddress: ${userAddress}`);
      console.log(`[PR Signature] Amount: ${amount}`);
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Cssg-Language': API_CONFIG.DEFAULT_LANGUAGE,
        'token': token || '',
      };
      if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

      const endpoint = isDevelopment ? `${API_CONFIG.OPENAPI_BASE_URL}/open/getLucaWithdrawalSign` : `${serverUrl}/open/getLucaWithdrawalSign`;
      const requestBody = isDevelopment ? { userAddress, amount, targetServerUrl: serverUrl } : { userAddress, amount };

      console.log(`[PR Signature] Endpoint: ${endpoint}`);
      console.log(`[PR Signature] Request body:`, requestBody);
      console.log(`[PR Signature] Headers:`, headers);

      const response = await axios.post(endpoint, requestBody, {
        headers,
        timeout: 5000,
        ...(shouldUseCredentials() && { withCredentials: true }),
      });

      console.log(`[PR Signature] Response from ${serverUrl}:`, response.data);

      // Check for various error conditions
      if (response.data?.errorcode === 'NOT_LOGGEDIN') {
        console.warn(`[PR Signature] NOT_LOGGEDIN error from ${serverUrl}`);
        return null;
      }

      if (response.data?.failed) {
        console.warn(`[PR Signature] Failed response from ${serverUrl}:`, response.data.msg);
        return null;
      }

      if (!response.data?.data?.sign) {
        console.warn(`[PR Signature] No signature in response from ${serverUrl}`);
        return null;
      }

      console.log(`[PR Signature] ✅ SUCCESS from ${serverUrl}`);
      return {
        sign: response.data.data.sign,
        expected_expiration: response.data.data.expected_expiration,
        code: response.data.data.code,
      };
    } catch (error: any) {
      console.error(`[PR Signature] ❌ ERROR from ${serverUrl}:`, {
        message: error.message,
        code: error.code,
        response: error.response?.data,
        status: error.response?.status
      });
      return null;
    }
  }

  private async collectPRSignatures(amount: number): Promise<{ signs: string[]; expected_expiration: number; code: string }> {
    const userAddress = authService.getUserAddress();
    if (!userAddress) throw new Error('User address not set');

    console.log(`[Collect Signatures] Starting collection for amount: ${amount}`);
    console.log(`[Collect Signatures] User address: ${userAddress}`);

    if (USE_CACHED_SIGNATURES === 1) {
      const cached = this.loadSignaturesFromCache(userAddress);
      if (cached) {
        console.log('[Collect Signatures] Using cached signatures');
        return cached;
      }
    }

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
    const signatures = { signs, expected_expiration, code };
    this.saveSigaturesToCache(signatures, userAddress);
    return signatures;
  }

  /**
   * Encode dynamic uint8 array
   */
  private encodeUint8Array(values: number[]): string {
    // Array length (32 bytes)
    const length = values.length.toString(16).padStart(64, '0');
    
    // Pack uint8 values (32 per word)
    let packed = '';
    for (let i = 0; i < values.length; i += 32) {
      const chunk = values.slice(i, i + 32);
      const word = chunk.map(v => v.toString(16).padStart(2, '0')).join('').padEnd(64, '0');
      packed += word;
    }
    
    return length + packed;
  }

  /**
   * Encode dynamic bytes32 array
   */
  private encodeBytes32Array(values: string[]): string {
    // Array length (32 bytes)
    const length = values.length.toString(16).padStart(64, '0');
    
    // Each bytes32 is already 32 bytes
    let data = '';
    for (const value of values) {
      const cleaned = value.startsWith('0x') ? value.slice(2) : value;
      data += cleaned.padStart(64, '0');
    }
    
    return length + data;
  }

  /**
   * Convert string to bytes32
   */
  private stringToBytes32(str: string): string {
    // Convert string to hex
    const hex = str.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    // Pad to 32 bytes (64 hex chars)
    return '0x' + hex.padEnd(64, '0');
  }

  /**
   * Execute withdrawal using pure Reown EIP-1193
   * Function: withdrawToken(address[2],uint256[2],bytes32,uint8[],bytes32[])
   */
  async executeWithdrawal(
    amount: number,
    signatures: string[],
    expiration: number,
    code: string,
    walletProvider: any
  ): Promise<any> {
    const userAddress = authService.getUserAddress();
    if (!userAddress) throw new Error('User address not set');

    try {
      // Check network
      const chainIdHex = await walletProvider.request({ method: 'eth_chainId' });
      const chainId = parseInt(chainIdHex, 16);
      if (chainId !== 56) {
        throw new Error(`Wrong network! Please switch to BSC Mainnet (chainId: 56). Current: ${chainId}`);
      }

      // Get withdrawal contract address (pledger contract on BSC)
      const { getChainById } = await import('../config/chains');
      const chain = getChainById(56);
      const withdrawalContract = chain?.contracts.pledger;
      
      if (!withdrawalContract) {
        throw new Error('Withdrawal contract address not found for BSC');
      }

      // Check expiration
      const currentTimestamp = Math.floor(Date.now() / 1000);
      if (currentTimestamp >= expiration) {
        throw new Error('Signatures have expired. Please try again to get fresh signatures.');
      }

      // Get LUCA token address
      const lucaToken = chain?.contracts.luca || chain?.lucaContract;
      if (!lucaToken) {
        throw new Error('LUCA token address not found for BSC');
      }

      // Process signatures into v and rs arrays
      const v: number[] = [];
      const rs: string[] = [];
      for (const sig of signatures) {
        const r = sig.slice(0, 66); // includes 0x
        const s = '0x' + sig.slice(66, 130);
        const vByte = parseInt(sig.slice(130, 132), 16);
        v.push(vByte);
        rs.push(r, s);
      }

      // Convert amount to wei
      const weiAmount = BigInt(amount) * BigInt(10 ** 18);

      // Encode withdrawToken function call
      // withdrawToken(address[2] addrs, uint256[2] uints, bytes32 code, uint8[] vs, bytes32[] rssMetadata)
      // Function selector: keccak256("withdrawToken(address[2],uint256[2],bytes32,uint8[],bytes32[])")
      const functionSelector = '0x3c423f0c'; // withdrawToken selector

      // Encode fixed-size parameters
      // address[2]: [token, user]
      const addr1 = lucaToken.slice(2).toLowerCase().padStart(64, '0');
      const addr2 = userAddress.slice(2).toLowerCase().padStart(64, '0');
      
      // uint256[2]: [amount, expiration]
      const uint1 = weiAmount.toString(16).padStart(64, '0');
      const uint2 = expiration.toString(16).padStart(64, '0');
      
      // bytes32: code
      const codeBytes32 = this.stringToBytes32(code).slice(2); // Remove 0x

      // Calculate offsets for dynamic arrays
      // Static params size: 5 * 32 = 160 bytes (2 addresses + 2 uints + 1 bytes32)
      // First dynamic array (vs) starts at byte 160 = 0xa0
      const vsOffset = (5 * 32).toString(16).padStart(64, '0');
      
      // Encode vs array
      const vsData = this.encodeUint8Array(v);
      const vsLength = vsData.length / 2; // Length in bytes
      
      // Second dynamic array (rssMetadata) starts after vs
      const rssOffset = (5 * 32 + vsLength).toString(16).padStart(64, '0');
      
      // Encode rss array
      const rssData = this.encodeBytes32Array(rs);

      // Combine all parts
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

      // Send transaction
      const txHash = await walletProvider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: userAddress,
          to: withdrawalContract,
          data,
          gas: '0x186a0' // 100000 gas
        }]
      });

      console.log('Transaction sent:', txHash);

      // Wait for confirmation
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
      const shouldClearCache = error?.message?.includes('Signatures have expired');
      if (shouldClearCache) this.clearSignatureCache();
      return { 
        success: false, 
        error: error?.message || 'Withdrawal failed' 
      };
    }
  }
}

/* ============================================================================
   COMMUNITY PROPOSAL SERVICE
   ============================================================================ */

class CommunityProposalService {
  async getMyPartList(status: string | number, searchKeys: string, pageIndex: number = 1, pageSize: number = 20, walletProvider?: any): Promise<ProposalListResponse> {
    try {
      const token = await authService.getToken(walletProvider);
      const headers: Record<string, string> = { 'Content-Type': 'application/x-www-form-urlencoded', 'token': token };
      if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

      const params = new URLSearchParams({ status: String(status || ''), searchKeys: searchKeys || '', pageIndex: String(pageIndex), pageSize: String(pageSize) });
      const response = await axios.post(`${API_CONFIG.WEB_API_BASE_URL}/community/getMyPartList`, params, { headers, withCredentials: true });

      if (response.data?.errorcode === 'NOT_LOGGEDIN' || !response.data?.success) {
        const newToken = await authService.authenticate(walletProvider);
        headers['token'] = newToken;
        const retryResponse = await axios.post(`${API_CONFIG.WEB_API_BASE_URL}/community/getMyPartList`, params, { headers, withCredentials: true });
        return retryResponse.data;
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error?.message || 'Failed to get proposals');
    }
  }

  async getMyInitiateList(status: string | number, searchKeys: string, pageIndex: number = 1, pageSize: number = 20, walletProvider?: any): Promise<ProposalListResponse> {
    try {
      const token = await authService.getToken(walletProvider);
      const headers: Record<string, string> = { 'Content-Type': 'application/x-www-form-urlencoded', 'token': token };
      if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

      const params = new URLSearchParams({ status: String(status || ''), searchKeys: searchKeys || '', pageIndex: String(pageIndex), pageSize: String(pageSize) });
      const response = await axios.post(`${API_CONFIG.WEB_API_BASE_URL}/community/getMyInitiateList`, params, { headers, withCredentials: true });

      if (response.data?.errorcode === 'NOT_LOGGEDIN' || !response.data?.success) {
        const newToken = await authService.authenticate(walletProvider);
        headers['token'] = newToken;
        const retryResponse = await axios.post(`${API_CONFIG.WEB_API_BASE_URL}/community/getMyInitiateList`, params, { headers, withCredentials: true });
        return retryResponse.data;
      }
      return response.data;
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error?.message || 'Failed to get proposals');
    }
  }

  async withdrawAGT(keyIds: string[], walletProvider?: any): Promise<{ success: boolean; message?: string }> {
    try {
      const token = await authService.getToken(walletProvider);
      const headers: Record<string, string> = { 'Content-Type': 'application/json', 'token': token };
      if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

      const response = await axios.post(`${API_CONFIG.WEB_API_BASE_URL}/community/withdrawAGT`, { keyIds }, { headers, withCredentials: true });

      if (response.data?.errorcode === 'NOT_LOGGEDIN' || !response.data?.success) {
        const newToken = await authService.authenticate(walletProvider);
        headers['token'] = newToken;
        const retryResponse = await axios.post(`${API_CONFIG.WEB_API_BASE_URL}/community/withdrawAGT`, { keyIds }, { headers, withCredentials: true });
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
      const token = await authService.getToken(walletProvider);
      const headers: Record<string, string> = { 'Content-Type': 'application/json', 'token': token };
      if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

      const response = await axios.post(
        `${API_CONFIG.WEB_API_BASE_URL}/community/createProposal`,
        proposalData,
        { headers, withCredentials: true }
      );

      if (response.data?.errorcode === 'NOT_LOGGEDIN' || !response.data?.success) {
        const newToken = await authService.authenticate(walletProvider);
        headers['token'] = newToken;
        const retryResponse = await axios.post(
          `${API_CONFIG.WEB_API_BASE_URL}/community/createProposal`,
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

/* ============================================================================
   CONSENSUS CONNECTION SERVICE
   ============================================================================ */

class ConsensusConnectionService {
  async getLinkList(linkStatus: number, userWalletAddress?: string, chainId?: string, walletProvider?: any) {
    try {
      const token = await authService.getToken(walletProvider);
      const headers: Record<string, string> = { 'Content-Type': 'application/json', 'token': token };
      if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

      const response = await axios.get(`${API_CONFIG.OPENAPI_BASE_URL}/open/getUserConnList`, {
        headers,
        withCredentials: true,
        params: { linkStatus, pageIndex: 1, pageSize: 100, ...(userWalletAddress && { userWalletAddress }), ...(chainId && { chainId }) },
      });

      if (response.data?.errorcode === 'NOT_LOGGEDIN' || response.data?.failed) {
        const newToken = await authService.authenticate(walletProvider);
        headers['token'] = newToken;
        const retryResponse = await axios.get(`${API_CONFIG.OPENAPI_BASE_URL}/open/getUserConnList`, {
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
      const token = await authService.getToken(walletProvider);
      const headers: Record<string, string> = { 'Content-Type': 'application/json', 'token': token };
      if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

      const response = await axios.get(`${API_CONFIG.OPENAPI_BASE_URL}/open/getTreatyList`, { headers, withCredentials: true });

      if (response.data?.errorcode === 'NOT_LOGGEDIN' || response.data?.failed) {
        const newToken = await authService.authenticate(walletProvider);
        headers['token'] = newToken;
        const retryResponse = await axios.get(`${API_CONFIG.OPENAPI_BASE_URL}/open/getTreatyList`, { headers, withCredentials: true });
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
      const token = await authService.getToken(walletProvider);
      const headers: Record<string, string> = { 'Content-Type': 'application/json', 'token': token };
      if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

      const payload = { treatyId: connectionId, nodeAddress, action };
      const response = await axios.post(`${API_CONFIG.OPENAPI_BASE_URL}/open/updateLedgeStatus`, payload, { headers, withCredentials: true });

      if (response.data?.errorcode === 'NOT_LOGGEDIN' || response.data?.failed) {
        const newToken = await authService.authenticate(walletProvider);
        headers['token'] = newToken;
        const retryResponse = await axios.post(`${API_CONFIG.OPENAPI_BASE_URL}/open/updateLedgeStatus`, payload, { headers, withCredentials: true });
        if (retryResponse.data?.errorcode === 'NOT_LOGGEDIN') throw new Error('Authentication required');
        return { success: retryResponse.data?.success !== false, message: retryResponse.data?.message || 'Pledge status updated' };
      }
      return { success: response.data?.success !== false, message: response.data?.message || 'Pledge status updated' };
    } catch (error: any) {
      throw new Error(error?.response?.data?.message || error?.message || 'Failed to update pledge status');
    }
  }
}

/* ============================================================================
   CONNECTION CREATION SERVICE - REOWN
   ============================================================================ */

class ConnectionCreationService {

  validateAddress(address: string): boolean {
  if (!address || typeof address !== 'string') return false;
  if (!/^0x[a-fA-F0-9]{40}$/.test(address)) return false;
  return true;
}

  private toWei(amount: number, decimals: number): bigint {
    // Convert to string with full precision
    const amountStr = amount.toFixed(decimals);
    // Split into integer and decimal parts
    const [intPart, decPart = ''] = amountStr.split('.');
    // Pad decimal part with zeros to match decimals
    const paddedDec = decPart.padEnd(decimals, '0');
    // Combine and convert to BigInt
    return BigInt(intPart + paddedDec);
  }
  // ABI encoding helper for dynamic string
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
    // Native tokens don't need approval
    if (['BNB', 'ETH', 'MATIC', 'AVAX', 'KUB'].includes(currency)) return true;

    const tokenAddress = currency.includes('0x')
      ? currency
      : this.getTokenAddress(currency, currencyList);

    if (!tokenAddress) return false;

    try {
      const address = authService.getUserAddress();
      if (!address) throw new Error('User address not set');

      // allowance(address,address) = 0xdd62ed3e
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

      // If RPC error (-32002, -32603, etc), assume no allowance and proceed with approval
      // The approval transaction will fail gracefully if not needed
      if (error.code && String(error.code).startsWith('-32')) {
        console.log('RPC error detected, skipping allowance check and proceeding to approval');
        return false; // Trigger approval flow
      }

      // For other errors, also assume needs approval
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
      const address = authService.getUserAddress();
      if (!address) throw new Error('User address not set');

      // FIX: Proper decimal to BigInt conversion
      // Convert to string with full precision, remove decimal point, pad with zeros
      const amountStr = amount.toFixed(weiPlaces); // e.g., "0.5000" with 4 decimals
      const [intPart, decPart = ''] = amountStr.split('.');
      const paddedDec = decPart.padEnd(weiPlaces, '0');
      const weiAmount = BigInt(intPart + paddedDec); // Combine and convert to BigInt

      console.log('Approval amount:', {
        original: amount,
        weiPlaces,
        amountStr,
        weiAmount: weiAmount.toString()
      });

      // approve(address,uint256) = 0x095ea7b3
      const data = '0x095ea7b3' +
        contractForApproval.slice(2).toLowerCase().padStart(64, '0') +
        weiAmount.toString(16).padStart(64, '0');

      const txHash = await walletProvider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: tokenAddress,
          data,
          gas: '0x15f90' // 90000
        }]
      });

      // Wait for confirmation
      for (let i = 0; i < 60; i++) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const receipt = await walletProvider.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        });

        if (receipt) {
          if (receipt.status === '0x0') {
            throw new Error('Approval transaction failed');
          }
          console.log('Approval successful:', txHash);
          return { status: true };
        }
      }

      throw new Error('Approval timeout');
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
      // getApproved(uint256) = 0x081812fc
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
    const address = authService.getUserAddress();
    if (!address) throw new Error('User address not set');

    // approve(address,uint256) = 0x095ea7b3
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

    // Wait for confirmation
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
      const address = authService.getUserAddress();
      if (!address) return false;

      // ownerOf(uint256) = 0x6352211e
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
    const address = authService.getUserAddress();
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

      // Function: createLink(address _userB, string _symbol, uint256 _tatalPlan, uint256 _percentA, uint256 _lockDays)
      // Selector: first 4 bytes of keccak256("createLink(address,string,uint256,uint256,uint256)")
      // Pre-computed: 0x8b73487e

      const functionSelector = '0x8b73487e';

      // Encode parameters according to ABI encoding rules
      // For dynamic types (string), we need offset pointers

      // Static parameters offsets
      const addressParam = toAddress.slice(2).toLowerCase().padStart(64, '0');
      const stringOffset = (5 * 32).toString(16).padStart(64, '0'); // Offset to string data (after 5 static params)
      const totalAmountParam = totalAmount.toString(16).padStart(64, '0');
      const percentAParam = BigInt(percentA).toString(16).padStart(64, '0');
      const lockDaysParam = BigInt(lockupDays).toString(16).padStart(64, '0');

      // Encode string (dynamic type)
      const stringLength = tokenSymbol.length.toString(16).padStart(64, '0');
      const stringBytes = tokenSymbol.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
      const stringData = stringBytes.padEnd(Math.ceil(stringBytes.length / 64) * 64, '0');

      const data = functionSelector +
        addressParam +
        stringOffset +
        totalAmountParam +
        percentAParam +
        lockDaysParam +
        stringLength +
        stringData;

      console.log('Transaction data:', data);

      // Calculate value for native token transfers
      const myAmount = (totalAmount * BigInt(percentA)) / BigInt(100);
      const isNativeToken = ['BNB', 'ETH', 'MATIC', 'AVAX', 'KUB'].includes(tokenSymbol);
      const value = isNativeToken ? '0x' + myAmount.toString(16) : '0x0';

      console.log('Transaction value:', value, 'isNative:', isNativeToken);

      const txHash = await walletProvider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: factoryAddress,
          data,
          value,
          gas: '0x7a120' // 500000 gas
        }]
      });

      console.log('Transaction sent:', txHash);

      // Wait for confirmation
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
    const address = authService.getUserAddress();
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

/* ============================================================================
   INCOME SERVICE
   ============================================================================ */

class IncomeService {
  private readonly PAGE_SIZE = 20;

  async getIncomeHistory(startTimestamps?: number, endTimestamps?: number): Promise<IncomeRecord[]> {
    const cacheKey = `income_${startTimestamps}_${endTimestamps}`;
    const cached = await encryptionService.getCache(cacheKey);
    if (cached) return cached;

    const token = await authService.getToken();
    let allData: IncomeRecord[] = [];
    let lastEvalKey = '';

    while (true) {
      const headers: Record<string, string> = { 'Content-Type': 'application/json', 'Cssg-Language': API_CONFIG.DEFAULT_LANGUAGE, 'token': token };
      if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

      const config: any = { headers, params: { pageSize: this.PAGE_SIZE, lastEvaluatedKey: lastEvalKey } };
      if (startTimestamps) config.params.startTimestamps = startTimestamps;
      if (endTimestamps) config.params.endTimestamps = endTimestamps;
      if (shouldUseCredentials()) config.withCredentials = true;

      const response = await axios.get(`${API_CONFIG.OPENAPI_BASE_URL}/open/getIncomeHistory`, config);
      if (response.data?.status === 'failed' || !response.data?.data) break;

      allData = [...allData, ...response.data.data];
      if (!response.data.mapData?.last_evaluated_key) break;
      lastEvalKey = response.data.mapData.last_evaluated_key;
    }

    await encryptionService.setCache(cacheKey, allData, CACHE_TTL);
    return allData;
  }

  async getAllIncomeHistory(): Promise<IncomeRecord[]> {
    return this.getIncomeHistory();
  }

  async getWithdrawalHistory(startTimestamps?: number, endTimestamps?: number): Promise<WithdrawalRecord[]> {
    const cacheKey = `withdrawal_${startTimestamps}_${endTimestamps}`;
    const cached = await encryptionService.getCache(cacheKey);
    if (cached) return cached;

    const token = await authService.getToken();
    let allData: WithdrawalRecord[] = [];
    let lastEvalKey = '';

    while (true) {
      const headers: Record<string, string> = { 'Content-Type': 'application/json', 'Cssg-Language': API_CONFIG.DEFAULT_LANGUAGE, 'token': token };
      if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

      const config: any = { headers, params: { pageSize: this.PAGE_SIZE, lastEvaluatedKey: lastEvalKey } };
      if (startTimestamps) config.params.startTimestamps = startTimestamps;
      if (endTimestamps) config.params.endTimestamps = endTimestamps;
      if (shouldUseCredentials()) config.withCredentials = true;

      const response = await axios.get(`${API_CONFIG.OPENAPI_BASE_URL}/open/getWithdrawalHistory`, config);
      if (response.data?.status === 'failed' || !response.data?.data) break;

      allData = [...allData, ...response.data.data];
      if (!response.data.mapData?.last_evaluated_key) break;
      lastEvalKey = response.data.mapData.last_evaluated_key;
    }

    await encryptionService.setCache(cacheKey, allData, CACHE_TTL);
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
    const cacheKey = `income_paginated_${offset}_${limit}`;
    const cached = await encryptionService.getCache(cacheKey);
    if (cached) return cached;

    const token = await authService.getToken();
    const headers: Record<string, string> = { 'Content-Type': 'application/json', 'Cssg-Language': API_CONFIG.DEFAULT_LANGUAGE, 'token': token };
    if (!isDevelopment) headers['apiToken'] = API_CONFIG.API_TOKEN;

    const config: any = { headers, params: { pageSize: limit, offset } };
    if (shouldUseCredentials()) config.withCredentials = true;

    const response = await axios.get(`${API_CONFIG.OPENAPI_BASE_URL}/open/getIncomeHistory`, config);
    const data = response.data?.data || [];
    await encryptionService.setCache(cacheKey, data, CACHE_TTL);
    return data;
  }

  async getRecentWithdrawalHistory(days: number = 30): Promise<WithdrawalRecord[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return this.getWithdrawalHistory(Math.floor(startDate.getTime() / 1000), Math.floor(endDate.getTime() / 1000));
  }

  clearCache(): void {
    encryptionService.clearCache();
  }
}

/* ============================================================================
   GAME SERVICE
   ============================================================================ */

class GameService {
  private getCommonHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return { 'Content-Type': 'application/json', ...(token && { token }) };
  }

  private getAuthHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return { 'Content-Type': 'application/json', 'Cssg-Language': API_CONFIG.DEFAULT_LANGUAGE, ...(token && { token }) };
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
      const response = await axios.post(`${API_CONFIG.GAME_API_BASE_URL}/game/createProposal`, data, { headers: this.getCommonHeaders(), withCredentials: true });
      return { message: response.data.message || 'Success', isSuccess: response.data.success || false, success: response.data.success || false, data: response.data.data };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async updateProposal(data: Partial<GameProposal>): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(`${API_CONFIG.GAME_API_BASE_URL}/game/updateProposal`, data, { headers: this.getCommonHeaders(), withCredentials: true });
      return { message: response.data.message || 'Success', isSuccess: response.data.success || false, success: response.data.success || false, data: response.data.data };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async getProposalByUserId(): Promise<ApiResponse<GameProposal[]>> {
    try {
      const userData = this.getUserDataFromStorage();
      if (!userData?.user?.id) throw new Error('User not authenticated');
      const response = await axios.post(`${API_CONFIG.GAME_API_BASE_URL}/game/getProposalByUserId`, { userId: userData.user.id }, { headers: this.getCommonHeaders(), withCredentials: true });
      return { data: response.data.data || [], isSuccess: response.data.success || false, success: response.data.success || false, message: 'Success' };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async getAdminProposal(): Promise<ApiResponse<GameProposal[]>> {
    try {
      const response = await axios.post(`${API_CONFIG.GAME_API_BASE_URL}/game/getAllProposal`, { blank: 'blank' }, { withCredentials: true, headers: this.getAuthHeaders() });
      return { data: response.data.data || [], isSuccess: response.data.success || false, success: response.data.success || false, message: 'Success' };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async updateProposalByAdmin(dataObject: any): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(`${API_CONFIG.GAME_API_BASE_URL}/game/updateGameStatus`, dataObject, { withCredentials: true, headers: this.getAuthHeaders() });
      return { data: response.data.data || '', isSuccess: response.data.success || false, success: response.data.success || false, message: 'Success' };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async getAllGame(): Promise<ApiResponse<Game[]>> {
    try {
      const response = await axios.post(`${API_CONFIG.GAME_API_BASE_URL}/game/getAllGame`, {}, { headers: this.getCommonHeaders(), withCredentials: true });
      return { data: response.data.data || [], isSuccess: response.data.success || false, success: response.data.success || false, message: 'Success' };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async getGameById(gameId: string): Promise<ApiResponse<Game>> {
    try {
      const response = await axios.post(`${API_CONFIG.GAME_API_BASE_URL}/game/getGameById`, { id: gameId }, { headers: this.getCommonHeaders(), withCredentials: true });
      return { data: response.data.data, isSuccess: response.data.success || false, success: response.data.success || false, message: 'Success' };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async gameRating(dataObject: GameRating): Promise<ApiResponse<any>> {
    try {
      const token = localStorage.getItem('token');
      const apiUrl = token ? `${API_CONFIG.GAME_API_BASE_URL}/game/knownRating` : `${API_CONFIG.GAME_API_BASE_URL}/game/anonymousRating`;
      const response = await axios.post(apiUrl, dataObject, { ...(token && { withCredentials: true }), headers: token ? this.getAuthHeaders() : this.getCommonHeaders() });
      return { data: response.data.data || '', isSuccess: response.data.success || false, success: response.data.success || false, message: 'Success' };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async gameContributed(dataObject: GameInvestment): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(`${API_CONFIG.GAME_API_BASE_URL}/game/invest`, dataObject, { withCredentials: true, headers: this.getAuthHeaders() });
      return { data: response.data.data || '', isSuccess: response.data.success || false, success: response.data.success || false, message: 'Success' };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async createBattle(data: BattleData): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(`${API_CONFIG.GAME_API_BASE_URL}/game/createBattle`, data, { headers: this.getCommonHeaders(), withCredentials: true });
      return { data: response.data.data || null, isSuccess: response.data.success || false, success: response.data.success || false, message: response.data.msg || 'Success', errorcode: response.data.errorcode, failed: response.data.failed, mapData: response.data.mapData, state: response.data.state, status: response.data.status, total: response.data.total };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async updateBattle(data: UpdateBattleData): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(`${API_CONFIG.GAME_API_BASE_URL}/game/updateBattle`, data, { headers: this.getCommonHeaders(), withCredentials: true });
      return { data: response.data.data || null, isSuccess: response.data.success || false, success: response.data.success || false, message: response.data.msg || 'Success', errorcode: response.data.errorcode, failed: response.data.failed, mapData: response.data.mapData, state: response.data.state, status: response.data.status, total: response.data.total };
    } catch (error: any) {
      return { message: error.response?.data?.message || 'Something went wrong', isSuccess: false, success: false };
    }
  }

  async getStars(data: UserStarsData): Promise<ApiResponse<any>> {
    try {
      const response = await axios.post(`${API_CONFIG.GAME_API_BASE_URL}/game/getStars`, data, { headers: this.getCommonHeaders(), withCredentials: true });
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

      const response = await axios({ method: 'post', maxBodyLength: Infinity, url: `${API_CONFIG.GAME_API_BASE_URL}/game/createProposal`, headers: this.getCommonHeaders(), data });
      return { message: response.data.message || response.data.data || 'Application submitted successfully', isSuccess: response.data.success || false };
    } catch (error) {
      return { message: errorText, isSuccess: false };
    }
  }
}

/* ============================================================================
   WEB API SERVICE
   ============================================================================ */

class WebAPIService {
  private getFormHeaders(): Record<string, string> {
    const token = localStorage.getItem('token');
    return { 'Content-Type': 'application/x-www-form-urlencoded', 'Cssg-Language': API_CONFIG.DEFAULT_LANGUAGE, ...(token && { token }) };
  }

  async fetchNewsList(pageIndex: number = 1, pageSize: number = 10, type: string = ''): Promise<NewsListResponse> {
    const params = new URLSearchParams({ pageIndex: pageIndex.toString(), pageSize: pageSize.toString(), type: type.toString() });
    const requestOptions: RequestInit = { method: 'POST', headers: this.getFormHeaders(), body: params };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/atm/getNewsList`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async getNewsDetail(newsId: string): Promise<any> {
    const params = new URLSearchParams({ newsId });
    const requestOptions: RequestInit = { method: 'POST', headers: this.getFormHeaders(), body: params };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/atm/getNewsDetail`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  showDefaultImageIfEmpty(news: NewsItem): void {
    if (!news.coverImg || news.coverImg.trim() === '') news.coverImg = '/images/junkNews.png';
  }

  async fetchPRNodes(): Promise<PRNodeItem[]> {
    const requestOptions: RequestInit = { method: 'GET', headers: this.getFormHeaders() };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/atm/getPRList`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result?.data?.prList || [];
  }

  async fetchStakeTransactions(): Promise<StakeTransactionItem[]> {
    const requestOptions: RequestInit = { method: 'GET', headers: this.getFormHeaders() };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/atm/getLedgeList`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result?.data?.ledgeList || [];
  }

  async fetchStakeTransactionsWithParams(pageIndex: number = 1, pageSize: number = 10, chainId?: string, searchKey?: string, searchType?: string, walletProvider?: any): Promise<any> {
    const params: any = { pageNo: pageIndex, pageSize };
    if (chainId) params.chainId = chainId;
    if (searchKey && searchType) params[searchType] = searchKey;
    const queryString = new URLSearchParams(params).toString();
    const token = walletProvider ? await authService.getToken(walletProvider) : '';
    const requestOptions: RequestInit = { method: 'GET', headers: { ...this.getFormHeaders(), ...(token && { token }) } };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/atm/treatyList?${queryString}`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async getContractInfo(walletProvider?: any): Promise<any> {
    const token = walletProvider ? await authService.getToken(walletProvider) : '';
    const requestOptions: RequestInit = { method: 'GET', headers: { ...this.getFormHeaders(), ...(token && { token }) } };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/atm/contractInfo`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async fetchPRNodesPaginated(pageNo: number, pageSize: number = 25, searchKey?: string, searchType?: string): Promise<{ success: boolean; data: PRNodeItem[]; total: number }> {
    const params: any = { pageNo, pageSize };
    if (searchKey && searchType) params[searchType] = searchKey;
    const queryString = new URLSearchParams(params).toString();
    const requestOptions: RequestInit = { method: 'GET', headers: this.getFormHeaders() };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/atm/prList?${queryString}`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return { success: result.success || false, data: result.data?.prList || [], total: result.data?.totalCount || 0 };
  }

  async fetchStakeTransactionsPaginated(pageNo: number, pageSize: number = 25, chainId: string | null = null, searchKey?: string, searchType?: string): Promise<{ success: boolean; data: StakeTransactionItem[]; total: number }> {
    const params: any = { pageNo, pageSize };
    if (chainId) params.chainId = chainId;
    if (searchKey && searchType) params[searchType] = searchKey;
    const queryString = new URLSearchParams(params).toString();
    const requestOptions: RequestInit = { method: 'GET', headers: this.getFormHeaders() };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/atm/treatyList?${queryString}`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return { success: result.success || false, data: result.data?.treatyList || [], total: result.data?.totalCount || 0 };
  }

  async fetchUserTreatyList(params: { ledgeAddress: string; chainId?: string; pageIndex: number; pageSize?: number; type: number }): Promise<{ success: boolean; data: { treatyList: any[]; totalCount: number } }> {
    const requestOptions: RequestInit = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ledgeAddress: params.ledgeAddress, chainId: params.chainId || '', pageIndex: params.pageIndex, pageSize: params.pageSize || 10, type: params.type }) };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${API_CONFIG.OPENAPI_BASE_URL}/getUserTreatyList`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async fetchBurnTotal(pageNo: number = 1, pageIndex: number = 1, pageSize: number = 5): Promise<any> {
    const params = new URLSearchParams({ pageNo: String(pageNo), pageIndex: String(pageIndex), pageSize: String(pageSize) });
    const requestOptions: RequestInit = { method: 'GET', headers: this.getFormHeaders() };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/atm/burnTotal?${params.toString()}`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async getOverview(): Promise<OverviewData> {
    const requestOptions: RequestInit = { method: 'GET', headers: this.getFormHeaders() };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/atm/getOverview`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result?.data || {};
  }

  async getCurrencyList(): Promise<CoinCurrency[]> {
    try {
      const config: any = { headers: this.getFormHeaders() };
      if (shouldUseCredentials()) config.withCredentials = true;
      const response = await axios.post(`${API_CONFIG.WEB_API_BASE_URL}/site/getCoinCurrencyList`, {}, config);
      const responseData = response.data?.data;
      if (responseData && Array.isArray(responseData.coinCurrencyPairList)) {
        return responseData.coinCurrencyPairList.filter((item: any) => item.aloneCalculateFlag === 1);
      }
      return this.getDefaultCurrencyList();
    } catch (error) {
      return this.getDefaultCurrencyList();
    }
  }

  private getDefaultCurrencyList(): CoinCurrency[] {
    return [{ id: 1, currencyKey: 'LUCA', currencyName: 'LUCA', currencyLogo: '/img/currency/luca.png', contractAddress: '0x51E6Ac1533032E72e92094867fD5921e3ea1bfa0', chainId: 56, nowPrice: 0.01, baseCurrency: 'LUCA', tradeCurrency: 'USDT', status: 1, gateWay: '0x51E6Ac1533032E72e92094867fD5921e3ea1bfa0', weiPlaces: '18', aloneCalculateFlag: 1, lockAmount: 1, pricePlaces: 4 }];
  }

  async subscribe(email: string): Promise<any> {
    const config: any = { headers: this.getFormHeaders() };
    if (shouldUseCredentials()) config.withCredentials = true;
    const response = await axios.post(`${API_CONFIG.WEB_API_BASE_URL}/atm/emailSubscription`, { email }, config);
    return response.data;
  }

  async getInitiateList(): Promise<any> {
    const params = new URLSearchParams({ pageIndex: '1', pageSize: '1' });
    const requestOptions: RequestInit = { method: 'POST', headers: this.getFormHeaders(), body: params };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/community/getInitiateList`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async sendContactMail(formData: ContactFormData, token: string): Promise<{ success: boolean; message: string }> {
    try {
      const emailContent = `New Contact Form Submission from ATM Website\n\nName: ${formData.name}\nEmail: ${formData.email}\nWallet Address: ${formData.walletAddress || 'Not provided'}\n\nMessage:\n${formData.message}\n\n---\nSubmitted at: ${new Date().toLocaleString()}`.trim();
      const requestBody = { personalizations: [{ to: [{ email: 'jainesh@kodelab.io' }], subject: 'New Contact Form Submission' }], from: { email: 'info@kodelab.io', name: 'ATM Website Contact Form' }, content: [{ type: 'text/plain', value: emailContent }] };
      const response = await fetch('https://svtest-web.kodelab.io/mail', { method: 'POST', headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` }, body: JSON.stringify(requestBody) });
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      return { success: true, message: result.message || 'Email sent successfully' };
    } catch (error: any) {
      return { success: false, message: error.message || 'Failed to send email. Please try again later.' };
    }
  }

  async getNFTProjectList(): Promise<{ success: boolean; data: { nftProjectList: NFTProject[] } }> {
    const requestOptions: RequestInit = { method: 'GET', headers: this.getFormHeaders() };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/nft/projectList`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async getNFTLinkList(params: { userWalletAddress?: string; linkStatus: number; pageIndex?: number; pageSize?: number; chainId?: string }): Promise<{ success: boolean; data: { linkList: NFTLinkConnection[]; linkCount: number; waitDealCount: number; otherDealCount: number } }> {
    const formParams = new URLSearchParams();
    if (params.userWalletAddress) formParams.append('userWalletAddress', params.userWalletAddress);
    formParams.append('linkStatus', params.linkStatus.toString());
    formParams.append('pageIndex', (params.pageIndex || 1).toString());
    formParams.append('pageSize', (params.pageSize || 20).toString());
    if (params.chainId) formParams.append('chainId', params.chainId);
    const requestOptions: RequestInit = { method: 'POST', headers: this.getFormHeaders(), body: formParams };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/nft/nftLinkList`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async getNFTLinkById(id: number): Promise<{ success: boolean; data: { linkRecord: NFTLinkConnection } }> {
    const formParams = new URLSearchParams();
    formParams.append('id', id.toString());
    const requestOptions: RequestInit = { method: 'POST', headers: this.getFormHeaders(), body: formParams };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/nft/nftLinkById`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    if (result.success && result.data?.linkRecord) {
      const record = result.data.linkRecord;
      const userAddress = localStorage.getItem('walletAddress');
      if (userAddress && record.createAddress.toLowerCase() === userAddress.toLowerCase()) {
        record.myNft = record.createLockNft;
        if (record.lockFlag === 1) record.myNft2 = record.targetLockNft;
        else record.targetNft = record.targetLockNft;
      } else {
        record.targetNft = record.createLockNft;
        if (record.lockFlag === 1) record.targetNft2 = record.targetLockNft;
        else record.myNft = record.targetLockNft;
      }
    }
    return result;
  }

  async getNFTMetadata(nftAddress: string, tokenId: string): Promise<any> {
    try {
      const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/nft/${nftAddress}/${tokenId}`);
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  async getUserPRCoinList(walletProvider?: any): Promise<any> {
    const token = walletProvider ? await authService.getToken(walletProvider) : '';
    const requestOptions: RequestInit = { method: 'GET', headers: { ...this.getFormHeaders(), ...(token && { token }) } };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/atm/userPrCoinList`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    if (result?.errorcode === 'NOT_LOGGEDIN' || result?.failed) {
      const newToken = await authService.authenticate(walletProvider);
      const retryOptions: RequestInit = { method: 'GET', headers: { ...this.getFormHeaders(), token: newToken } };
      if (shouldUseCredentials()) retryOptions.credentials = 'include';
      const retryResponse = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/atm/userPrCoinList`, retryOptions);
      if (!retryResponse.ok) throw new Error(`HTTP error! status: ${retryResponse.status}`);
      const retryResult = await retryResponse.json();
      return retryResult?.data || retryResult;
    }
    return result?.data || result;
  }

  async getUserPRCurve(networkType: string, walletProvider?: any): Promise<{ x: string[]; y: number[]; nowPr: number; pre: string }> {
    const token = walletProvider ? await authService.getToken(walletProvider) : '';
    const queryParams = new URLSearchParams({ networkType }).toString();
    const requestOptions: RequestInit = { method: 'GET', headers: { ...this.getFormHeaders(), ...(token && { token }) } };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/atm/userPrCurve?${queryParams}`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    if (result?.errorcode === 'NOT_LOGGEDIN' || result?.failed) {
      const newToken = await authService.authenticate(walletProvider);
      const retryOptions: RequestInit = { method: 'GET', headers: { ...this.getFormHeaders(), token: newToken } };
      if (shouldUseCredentials()) retryOptions.credentials = 'include';
      const retryResponse = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/atm/userPrCurve?${queryParams}`, retryOptions);
      if (!retryResponse.ok) throw new Error(`HTTP error! status: ${retryResponse.status}`);
      const retryResult = await retryResponse.json();
      return retryResult?.data || retryResult;
    }
    return result?.data || result;
  }

  async getUserAGTRecord(pageNo: number = 1, pageSize: number = 20, walletProvider?: any): Promise<{ list: any[]; agtTotal: number }> {
    const token = walletProvider ? await authService.getToken(walletProvider) : '';
    const queryParams = new URLSearchParams({ pageNo: pageNo.toString(), pageSize: pageSize.toString() }).toString();
    const requestOptions: RequestInit = { method: 'GET', headers: { ...this.getFormHeaders(), ...(token && { token }) } };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/atm/userAgtRecord?${queryParams}`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    if (result?.errorcode === 'NOT_LOGGEDIN' || result?.failed) {
      const newToken = await authService.authenticate(walletProvider);
      const retryOptions: RequestInit = { method: 'GET', headers: { ...this.getFormHeaders(), token: newToken } };
      if (shouldUseCredentials()) retryOptions.credentials = 'include';
      const retryResponse = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/atm/userAgtRecord?${queryParams}`, retryOptions);
      if (!retryResponse.ok) throw new Error(`HTTP error! status: ${retryResponse.status}`);
      const retryResult = await retryResponse.json();
      return { list: retryResult?.data?.list || [], agtTotal: retryResult?.data?.agtTotal || 0 };
    }
    return { list: result?.data?.list || [], agtTotal: result?.data?.agtTotal || 0 };
  }
}


/* ============================================================================
   AUTHORIZATION MANAGEMENT SERVICE - PURE REOWN
   ============================================================================ */

export interface TokenInfo {
  symbol: string;
  address: string;
  decimals: number;
  logo?: string;
}

export interface TokenApproval extends TokenInfo {
  allowance: string;
  spender: string;
}

export interface ContractSection {
  title: string;
  address?: string;
  tokens: TokenApproval[];
  expanded: boolean;
}

class AuthorizationService {
  
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

  /**
   * Format wei to decimal string
   
   */
  private formatUnits(value: bigint, decimals: number): string {
    const valueStr = value.toString();
    const isNegative = valueStr.startsWith('-');
    const absoluteValue = isNegative ? valueStr.slice(1) : valueStr;
    
    if (decimals === 0) return absoluteValue;
    
    const paddedValue = absoluteValue.padStart(decimals + 1, '0');
    const integerPart = paddedValue.slice(0, -decimals) || '0';
    const decimalPart = paddedValue.slice(-decimals);
    
    // Remove trailing zeros from decimal part
    const trimmedDecimal = decimalPart.replace(/0+$/, '');
    
    if (trimmedDecimal === '') {
      return (isNegative ? '-' : '') + integerPart;
    }
    
    return (isNegative ? '-' : '') + integerPart + '.' + trimmedDecimal;
  }

  /**
   * Check token allowance using pure Reown EIP-1193
   */
  async checkAllowance(
    tokenAddress: string,
    spenderAddress: string,
    decimals: number,
    address: string,
    walletProvider: any
  ): Promise<string> {
    if (!address || !walletProvider) return "0";
    
    try {
      // allowance(address,address) = 0xdd62ed3e
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

  /**
   * Load all approvals for user's tokens across multiple contracts
   */
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

  /**
   * Revoke token approval using pure Reown EIP-1193
   */
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
      // approve(address,uint256) = 0x095ea7b3
      // Set allowance to 0
      const data = '0x095ea7b3' +
        spenderAddress.slice(2).toLowerCase().padStart(64, '0') +
        '0'.padStart(64, '0'); // amount = 0

      const txHash = await walletProvider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: tokenAddress,
          data,
          gas: '0x15f90' // 90000 gas
        }]
      });

      // Wait for confirmation
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

/* ============================================================================
   AGF GAME PROPOSAL SERVICE
   ============================================================================ */

class AGFGameProposalService {

  private getAGFHeaders() {
    const loginToken = localStorage.getItem('token');
    return {
      token: loginToken || '',
      'Content-Type': 'application/json',
      'cssg-language': 'en',
    };
  }

  private getAGFBaseURL(): string {
    const AGF_BASE_URL = import.meta.env.VITE_AGF_PROPOSAL_PATH;
    return AGF_BASE_URL || '';
  }

  /**
   * Get proposals created by current user
   */
  async getProposalByUserId(): Promise<AGFProposalResponse> {
    try {
      const apiUrl = `${this.getAGFBaseURL()}/game/v2/getProposal`;
      const data = { userId: 'userId' };

      const response = await axios.post(apiUrl, data, {
        withCredentials: true,
        headers: this.getAGFHeaders(),
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

  /**
   * Get all proposals (admin only)
   */
  async getAdminProposal(): Promise<AGFProposalResponse> {
    try {
      const apiUrl = `${this.getAGFBaseURL()}/game/getAllProposal`;
      const data = { blank: 'blank' };

      const response = await axios.post(apiUrl, data, {
        withCredentials: true,
        headers: this.getAGFHeaders(),
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

  /**
   * Update proposal status (admin only)
   */
  async updateProposalByAdmin(dataObject: any): Promise<{ success: boolean; isSuccess: boolean; data: any; message?: string }> {
    try {
      const apiUrl = `${this.getAGFBaseURL()}/game/updateGameStatus`;

      const response = await axios.post(apiUrl, dataObject, {
        withCredentials: true,
        headers: this.getAGFHeaders(),
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

  /**
   * Create new game proposal
   */
  async createProposal(data: any): Promise<{ success: boolean; isSuccess: boolean; message: string }> {
    try {
      const apiUrl = `${this.getAGFBaseURL()}/game/v2/createProposal`;

      const response = await axios.post(apiUrl, data, {
        withCredentials: true,
        headers: this.getAGFHeaders(),
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

  /**
   * Update existing game proposal
   */
  async updateProposal(data: any): Promise<{ success: boolean; isSuccess: boolean; message: string }> {
    try {
      const apiUrl = `${this.getAGFBaseURL()}/game/updateProposal`;

      const response = await axios.post(apiUrl, data, {
        withCredentials: true,
        headers: this.getAGFHeaders(),
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

  /**
   * Parse AGF proposal data and store in localStorage (like unWrapAGFProposal from Vue)
   */
  unwrapAGFProposal(data: AGFGameProposal): void {
    try {
      // Find email from contacts
      const emailDetails = data.contactDetails.find(
        (contact) => contact.name === "email"
      );

      // Map social platform contacts (excluding email)
      const contactDetailsSocialPlatform = data.contactDetails
        .filter((contact) => contact.name !== "email")
        .map((contact) => ({
          platform: contact.name || "Not found",
          link: contact.description || "Not found",
          images: contact.images || "Not found",
        }));

      // Game concept
      const gameConcept = {
        id: data.id || "",
        title: data.title || "",
        overview: data.overview || "",
        gamePlay: data.gameplay || "",
        notes: data.notes || "",
        createdBy: data.createdBy || "",
      };

      // Connection details
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

      // Milestones
      const milestones = data.milestones.map((milestone) => ({
        id: milestone.id || "",
        milestoneTitle: milestone.title || "",
        milestoneDescription: milestone.description || "",
        milestoneTimeDuration: milestone.deadline || "",
        milestoneFundNeeded: milestone.funds.toString() || "0.00",
      }));

      // Media (images and videos)
      const imagesArray: any[] = [];
      const videoArray: any[] = [];

      data.gamesMediaModelList.forEach((media) => {
        if (media.type === 1) {
          imagesArray.push(media);
        } else if (media.type === 2) {
          videoArray.push(media);
        }
      });

      // Categories
      const categories = data.gameCategoriesModelList.map((item) =>
        item.categoryId.toString()
      );

      // Contact data
      const contactData = {
        email: emailDetails?.description || "",
        socialPlatform: contactDetailsSocialPlatform,
      };

      // Save to localStorage
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

  /**
   * Wrap localStorage data into AGF proposal format (reverse of unwrap)
   */
  wrapAGFProposal(isEdit: boolean = false): any {
    try {
      const imagesArray = JSON.parse(localStorage.getItem('imagesArray') || '[]');
      const videoArray = JSON.parse(localStorage.getItem('videoArray') || '[]');
      const gameConcept = JSON.parse(localStorage.getItem('gameConcept') || '{}');
      const connectionDetails = JSON.parse(localStorage.getItem('connectionDetails') || '{}');
      const contactDetails = JSON.parse(localStorage.getItem('contactDetails') || '{}');
      const milestones = JSON.parse(localStorage.getItem('milestones') || '[]');
      const categories = JSON.parse(localStorage.getItem('selectedCategories') || '[]');

      // Calculate total funds from milestones
      const totalFundsNeeded = milestones.reduce((total: number, milestone: any) => {
        return total + (parseFloat(milestone.milestoneFundNeeded) || 0.00);
      }, 0.00);

      // Filter and combine media
      const filteredImagesArray = imagesArray.filter((image: any) => image.link !== '');
      const combinedArray = [...filteredImagesArray, ...videoArray];

      const gamesMediaModelList = combinedArray
        .filter((item: any) => item.link)
        .map((item: any) => ({
          ...item,
          link: this.ensureValidUrl(item.link)
        }));

      // Prepare contact details with email
      const allContactDetails = [...(contactDetails.socialPlatform || [])];
      if (contactDetails.email) {
        allContactDetails.push({
          platform: 'email',
          description: contactDetails.email,
          link: contactDetails.email
        });
      }

      // Build proposal data
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

      // Add ID and createdBy if editing
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

  /**
   * Ensure URL is valid
   */
  private ensureValidUrl(url: string): string {
    try {
      new URL(url);
      return url;
    } catch {
      return '';
    }
  }

  /**
   * Clear all AGF proposal data from localStorage
   */
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

/* ============================================================================
   RECOVERY PLAN SERVICE
   ============================================================================ */

export interface RecoveryTransaction {
  createTime: string;
  burnAmount?: string;
  useAmount?: string;
  hash: string;
  lockAmount?: string;
  lockCurrency?: string;
}

class RecoveryPlanService {
  
  /**
   * Format wei to ether string (18 decimals)
   */
  private formatEther(value: bigint): string {
    return this.formatUnits(value, 18);
  }

  /**
   * Format wei to decimal string
   
   */
  private formatUnits(value: bigint, decimals: number): string {
    const valueStr = value.toString();
    const isNegative = valueStr.startsWith('-');
    const absoluteValue = isNegative ? valueStr.slice(1) : valueStr;
    
    if (decimals === 0) return absoluteValue;
    
    const paddedValue = absoluteValue.padStart(decimals + 1, '0');
    const integerPart = paddedValue.slice(0, -decimals) || '0';
    const decimalPart = paddedValue.slice(-decimals);
    
    // Remove trailing zeros from decimal part
    const trimmedDecimal = decimalPart.replace(/0+$/, '');
    
    if (trimmedDecimal === '') {
      return (isNegative ? '-' : '') + integerPart;
    }
    
    return (isNegative ? '-' : '') + integerPart + '.' + trimmedDecimal;
  }

  /**
   * Direct RPC call 
   */
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

  /**
   * Decode ABI-encoded data manually
   * For event: Invest(address indexed user, uint256 amount)
   * Non-indexed parameters are in data field
   */
  private decodeEventData(data: string): { address: string; amount: bigint } {
    // Remove 0x prefix
    const hexData = data.startsWith('0x') ? data.slice(2) : data;
    
    // Each parameter is 32 bytes (64 hex characters)
    // First 32 bytes: address (right-aligned, last 20 bytes are the address)
    const addressHex = hexData.slice(24, 64); // Take last 20 bytes of first 32 bytes
    const address = '0x' + addressHex;
    
    // Second 32 bytes: uint256 amount
    const amountHex = hexData.slice(64, 128);
    const amount = BigInt('0x' + amountHex);
    
    return { address, amount };
  }

  /**
   * Get recovery pot balance using pure RPC call
   */
  async getRecoveryPotBalance(chainId: number): Promise<string> {
    try {
      const RECOVER_FUND_ADDRESS = import.meta.env.VITE_POT_WALLET;
      if (!RECOVER_FUND_ADDRESS) return "0";

      const { getChainById } = await import("../config/chains");
      const chain = getChainById(chainId);
      if (!chain) return "0";

      // balance() = 0xb69ef8a8
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

  /**
   * Get recovery transactions by decoding event logs manually
   */
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
        
        // Check if this is the Invest event
        if (temp.topics[0] === INVEST_EVENT) {
          // Decode the non-indexed parameters from data field
          const decoded = this.decodeEventData(temp.data);

          // Check if this event is for the user's address
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

/* ============================================================================
   LINK CONNECTION SERVICE
   ============================================================================ */

class LinkConnectionService {
  
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
      const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/nft/${nftAddress}/${tokenId}`);
      return await response.json();
    } catch (error) {
      console.error(`Failed to fetch metadata for token ${tokenId}:`, error);
      return null;
    }
  }

  /**
   * Agree to connection (called by target user)
   * For NFT connections, tokenId is required
   */
  async agreeConnection(
    linkAddress: string,
    tokenId: string | undefined,
    walletProvider: any
  ): Promise<{ success: boolean; message?: string; hash?: string }> {
    if (!walletProvider) {
      throw new Error('Wallet provider required');
    }

    try {
      const address = authService.getUserAddress();
      if (!address) throw new Error('User address not set');

      // Import ABI
      const LINK_ABI = [
        "function agree() external",
        "function agree(uint256 tokenId) external"
      ];

      // Determine function signature based on whether tokenId is provided
      const functionSelector = tokenId 
        ? '0x' + require('crypto').createHash('sha256').update('agree(uint256)').digest('hex').slice(0, 8)
        : '0x' + require('crypto').createHash('sha256').update('agree()').digest('hex').slice(0, 8);

      let data: string;
      
      if (tokenId) {
        // agree(uint256) = 0xf6cd35ee (first 4 bytes of keccak256)
        data = '0xf6cd35ee' + BigInt(tokenId).toString(16).padStart(64, '0');
      } else {
        // agree() = 0xc68910eb
        data = '0xc68910eb';
      }

      const txHash = await walletProvider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: address,
          to: linkAddress,
          data,
          gas: '0x15f90' // 90000
        }]
      });

      // Wait for confirmation
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

  /**
   * Cancel connection (called by creator before agreement)
   */
  async cancelConnection(
    linkAddress: string,
    walletProvider: any
  ): Promise<{ success: boolean; message?: string; hash?: string }> {
    if (!walletProvider) {
      throw new Error('Wallet provider required');
    }

    try {
      const address = authService.getUserAddress();
      if (!address) throw new Error('User address not set');

      // cancel() = 0xea8a1af0
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

      // Wait for confirmation
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

  /**
   * Reject connection (called by target user)
   */
  async rejectConnection(
    linkAddress: string,
    walletProvider: any
  ): Promise<{ success: boolean; message?: string; hash?: string }> {
    if (!walletProvider) {
      throw new Error('Wallet provider required');
    }

    try {
      const address = authService.getUserAddress();
      if (!address) throw new Error('User address not set');

      // reject() = 0x97aba7f9
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

      // Wait for confirmation
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

  /**
   * Close/Redeem connection (called when expired)
   */
  async closeConnection(
    linkAddress: string,
    walletProvider: any
  ): Promise<{ success: boolean; message?: string; hash?: string }> {
    if (!walletProvider) {
      throw new Error('Wallet provider required');
    }

    try {
      const address = authService.getUserAddress();
      if (!address) throw new Error('User address not set');

      // close() = 0x43d726d6
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

      // Wait for confirmation
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

/* ============================================================================
   CROSSCHAIN SERVICE - PURE REOWN
   ============================================================================ */

class CrosschainService {
  
  /**
   * Convert decimal amount to wei (18 decimals)
   */
  private parseUnits(amount: string, decimals: number = 18): bigint {
    // Handle decimal numbers
    const [integerPart, decimalPart = ''] = amount.split('.');
    
    // Pad or truncate decimal part to match decimals
    const paddedDecimal = decimalPart.padEnd(decimals, '0').slice(0, decimals);
    
    // Combine and convert to BigInt
    const combined = integerPart + paddedDecimal;
    return BigInt(combined);
  }

  /**
   * Encode string parameter for ABI
   */
  private encodeString(str: string): string {
    // Convert string to hex
    const hex = str.split('').map(c => c.charCodeAt(0).toString(16).padStart(2, '0')).join('');
    
    // String length in hex (32 bytes)
    const length = str.length.toString(16).padStart(64, '0');
    
    // Pad hex to 32-byte boundary
    const paddedHex = hex.padEnd(Math.ceil(hex.length / 64) * 64, '0');
    
    return length + paddedHex;
  }

  /**
   * Execute cross-chain token transfer using pure Reown EIP-1193
   */
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
      // Convert amount to wei
      const amountWei = this.parseUnits(amount, 18);

      // Step 1: Check allowance
      // allowance(address,address) = 0xdd62ed3e
      console.log('Checking allowance...');
      const allowanceData = '0xdd62ed3e' +
        userAddress.slice(2).toLowerCase().padStart(64, '0') +
        crosschainAddress.slice(2).toLowerCase().padStart(64, '0');

      const allowanceResult = await walletProvider.request({
        method: 'eth_call',
        params: [{ to: tokenAddress, data: allowanceData }, 'latest']
      });

      const allowance = BigInt(allowanceResult);

      // Step 2: Approve if needed
      if (allowance < amountWei) {
        console.log('Requesting approval...');
        
        // approve(address,uint256) = 0x095ea7b3
        const approveData = '0x095ea7b3' +
          crosschainAddress.slice(2).toLowerCase().padStart(64, '0') +
          amountWei.toString(16).padStart(64, '0');

        const approveTxHash = await walletProvider.request({
          method: 'eth_sendTransaction',
          params: [{
            from: userAddress,
            to: tokenAddress,
            data: approveData,
            gas: '0x15f90' // 90000
          }]
        });

        // Wait for approval confirmation
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

      // Step 3: Map chain name
      const chainNameMap: { [key: string]: string } = {
        bsc: 'Binance',
        ethereum: 'Ethereum',
        polygon: 'Polygon',
        arbitrum: 'Arbitrum',
        optimism: 'Optimism'
      };
      const mappedChain = chainNameMap[destinationChain] || destinationChain;

      // Step 4: Execute cross-chain transfer
      // stakeToken(string _chain, address _to, address _token, uint256 _amount)
      // Function selector: first 4 bytes of keccak256("stakeToken(string,address,address,uint256)")
      console.log('Initiating cross-chain transfer...');
      
      // Manual ABI encoding for stakeToken
      const functionSelector = '0x7f8c99b5'; // stakeToken selector
      
      // Calculate offsets for dynamic types
      const staticParamsSize = 4 * 32; // 4 static parameters (string offset, 3 addresses/uints)
      const stringOffset = staticParamsSize.toString(16).padStart(64, '0');
      
      // Encode parameters
      const toAddressParam = receivingAddress.slice(2).toLowerCase().padStart(64, '0');
      const tokenAddressParam = tokenAddress.slice(2).toLowerCase().padStart(64, '0');
      const amountParam = amountWei.toString(16).padStart(64, '0');
      
      // Encode string (chain name)
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
          gas: '0xc3500' // 800000
        }]
      });

      console.log('Transaction hash:', txHash);
      
      // Wait for confirmation
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
      
      // Handle specific error codes
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



/* ============================================================================
   SERVICE INSTANCES & EXPORTS
   ============================================================================ */

export const encryptionService = new EncryptionService();
export const authService = new AuthenticationService();
export const withdrawalService = new WithdrawalService();
export const proposalService = new CommunityProposalService();
export const connectionService = new ConsensusConnectionService();
export const incomeService = new IncomeService();
export const gameService = new GameService();
export const webAPIService = new WebAPIService();
export const connectionCreationService = new ConnectionCreationService();
export const authorizationService = new AuthorizationService();
export const recoveryPlanService = new RecoveryPlanService();
export const agfGameProposalService = new AGFGameProposalService();
export const linkConnectionService = new LinkConnectionService();
export const crosschainService = new CrosschainService();

export const WebAppService = {
  encryption: encryptionService,
  auth: authService,
  withdrawal: withdrawalService,
  proposal: proposalService,
  connection: connectionService,
  income: incomeService,
  game: gameService,
  webAPI: webAPIService,
  connectionCreation: connectionCreationService,
  authorization: authorizationService,
  recoveryPlan: recoveryPlanService,
  agfGameProposal: agfGameProposalService,
  linkConnection: linkConnectionService,
  crosschain: crosschainService,
};

export default WebAppService;