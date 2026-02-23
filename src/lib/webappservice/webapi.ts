import axios from 'axios';
import { API_CONFIG, shouldUseCredentials } from './constants';
import { getFormHeaders } from './headers';
import { urls } from './urls';
import type { NewsListResponse, PRNodeItem, StakeTransactionItem, OverviewData, CoinCurrency, NFTProject, NFTLinkConnection, ContactFormData, RankingItem } from './types';
import type { AuthenticationService } from './services';

export class WebAPIService {
  private authService: AuthenticationService;

  constructor(authService: AuthenticationService) {
    this.authService = authService;
  }

  private getFormHeadersLocal(): Record<string, string> {
    const token = localStorage.getItem('atm_token');
    return getFormHeaders(token);
  }

  async fetchNewsList(pageIndex: number = 1, pageSize: number = 10, type: string = ''): Promise<NewsListResponse> {
    const params = new URLSearchParams({ pageIndex: pageIndex.toString(), pageSize: pageSize.toString(), type: type.toString() });
    const requestOptions: RequestInit = { method: 'POST', headers: this.getFormHeadersLocal(), body: params };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(urls.atm.getNewsList, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async getNewsDetail(newsId: string): Promise<any> {
    const params = new URLSearchParams({ newsId });
    const requestOptions: RequestInit = { method: 'POST', headers: this.getFormHeadersLocal(), body: params };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(urls.atm.getNewsDetail, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  showDefaultImageIfEmpty(news: { coverImg: string }): void {
    if (!news.coverImg || news.coverImg.trim() === '') news.coverImg = '/images/junkNews.png';
  }

  async fetchPRNodes(): Promise<PRNodeItem[]> {
    const requestOptions: RequestInit = { method: 'GET', headers: this.getFormHeadersLocal() };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(urls.atm.getPRList, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result?.data?.prList || [];
  }

  async fetchStakeTransactions(): Promise<StakeTransactionItem[]> {
    const requestOptions: RequestInit = { method: 'GET', headers: this.getFormHeadersLocal() };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(urls.atm.getLedgeList, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result?.data?.ledgeList || [];
  }

  async fetchStakeTransactionsWithParams(pageIndex: number = 1, pageSize: number = 10, chainId?: string, searchKey?: string, searchType?: string, walletProvider?: any): Promise<any> {
    const params: any = { pageNo: pageIndex, pageSize };
    if (chainId) params.chainId = chainId;
    if (searchKey && searchType) params[searchType] = searchKey;
    const queryString = new URLSearchParams(params).toString();
    const token = walletProvider ? await this.authService.getToken(walletProvider) : '';
    const requestOptions: RequestInit = { method: 'GET', headers: { ...this.getFormHeadersLocal(), ...(token && { token }) } };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${urls.atm.treatyList}?${queryString}`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async getContractInfo(walletProvider?: any): Promise<any> {
    const token = walletProvider ? await this.authService.getToken(walletProvider) : '';
    const requestOptions: RequestInit = { method: 'GET', headers: { ...this.getFormHeadersLocal(), ...(token && { token }) } };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(urls.atm.contractInfo, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async fetchPRNodesPaginated(pageNo: number, pageSize: number = 25, searchKey?: string, searchType?: string): Promise<{ success: boolean; data: PRNodeItem[]; total: number }> {
    const params: any = { pageNo, pageSize };
    if (searchKey && searchType) params[searchType] = searchKey;
    const queryString = new URLSearchParams(params).toString();
    const requestOptions: RequestInit = { method: 'GET', headers: this.getFormHeadersLocal() };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${urls.atm.prList}?${queryString}`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return { success: result.success || false, data: result.data?.prList || [], total: result.data?.totalCount || 0 };
  }

  async fetchStakeTransactionsPaginated(pageNo: number, pageSize: number = 25, chainId: string | null = null, searchKey?: string, searchType?: string): Promise<{ success: boolean; data: StakeTransactionItem[]; total: number }> {
    const params: any = { pageNo, pageSize };
    if (chainId) params.chainId = chainId;
    if (searchKey && searchType) params[searchType] = searchKey;
    const queryString = new URLSearchParams(params).toString();
    const requestOptions: RequestInit = { method: 'GET', headers: this.getFormHeadersLocal() };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${urls.atm.treatyList}?${queryString}`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return { success: result.success || false, data: result.data?.treatyList || [], total: result.data?.totalCount || 0 };
  }

  async fetchUserTreatyList(params: { ledgeAddress: string; chainId?: string; pageIndex: number; pageSize?: number; type: number }): Promise<{ success: boolean; data: { treatyList: any[]; totalCount: number } }> {
    const requestOptions: RequestInit = { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ledgeAddress: params.ledgeAddress, chainId: params.chainId || '', pageIndex: params.pageIndex, pageSize: params.pageSize || 10, type: params.type }) };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(urls.open.getUserTreatyList, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async fetchBurnTotal(pageNo: number = 1, pageIndex: number = 1, pageSize: number = 5): Promise<any> {
    const params = new URLSearchParams({ pageNo: String(pageNo), pageIndex: String(pageIndex), pageSize: String(pageSize) });
    const requestOptions: RequestInit = { method: 'GET', headers: this.getFormHeadersLocal() };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${urls.atm.burnTotal}?${params.toString()}`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async getOverview(): Promise<OverviewData> {
    const requestOptions: RequestInit = { method: 'GET', headers: this.getFormHeadersLocal() };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(urls.atm.getOverview, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    return result?.data || {};
  }

  async getCurrencyList(): Promise<CoinCurrency[]> {
    try {
      const config: any = { headers: this.getFormHeadersLocal() };
      if (shouldUseCredentials()) config.withCredentials = true;
      const response = await axios.post(urls.site.getCoinCurrencyList, {}, config);
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
    const config: any = { headers: this.getFormHeadersLocal() };
    if (shouldUseCredentials()) config.withCredentials = true;
    const response = await axios.post(urls.atm.emailSubscription, { email }, config);
    return response.data;
  }

  async getInitiateList(): Promise<any> {
    const params = new URLSearchParams({ pageIndex: '1', pageSize: '1' });
    const requestOptions: RequestInit = { method: 'POST', headers: this.getFormHeadersLocal(), body: params };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(urls.community.getInitiateList, requestOptions);
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
    const requestOptions: RequestInit = { method: 'GET', headers: this.getFormHeadersLocal() };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(urls.nft.projectList, requestOptions);
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
    const requestOptions: RequestInit = { method: 'POST', headers: this.getFormHeadersLocal(), body: formParams };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(urls.nft.nftLinkList, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    return await response.json();
  }

  async getNFTLinkById(id: number): Promise<{ success: boolean; data: { linkRecord: NFTLinkConnection } }> {
    const formParams = new URLSearchParams();
    formParams.append('id', id.toString());
    const requestOptions: RequestInit = { method: 'POST', headers: this.getFormHeadersLocal(), body: formParams };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(urls.nft.nftLinkById, requestOptions);
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
      const response = await fetch(urls.nft.metadata(nftAddress, tokenId));
      return await response.json();
    } catch (error) {
      return null;
    }
  }

  async getUserPRCoinList(walletProvider?: any): Promise<any> {
    const token = walletProvider ? await this.authService.getToken(walletProvider) : '';
    const requestOptions: RequestInit = { method: 'GET', headers: { ...this.getFormHeadersLocal(), ...(token && { token }) } };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(urls.atm.userPrCoinList, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    if (result?.errorcode === 'NOT_LOGGEDIN' || result?.failed) {
      const newToken = await this.authService.authenticate(walletProvider);
      const retryOptions: RequestInit = { method: 'GET', headers: { ...this.getFormHeadersLocal(), token: newToken } };
      if (shouldUseCredentials()) retryOptions.credentials = 'include';
      const retryResponse = await fetch(urls.atm.userPrCoinList, retryOptions);
      if (!retryResponse.ok) throw new Error(`HTTP error! status: ${retryResponse.status}`);
      const retryResult = await retryResponse.json();
      return retryResult?.data || retryResult;
    }
    return result?.data || result;
  }

  async getUserPRCurve(networkType: string, walletProvider?: any): Promise<{ x: string[]; y: number[]; nowPr: number; pre: string }> {
    const token = walletProvider ? await this.authService.getToken(walletProvider) : '';
    const queryParams = new URLSearchParams({ networkType }).toString();
    const requestOptions: RequestInit = { method: 'GET', headers: { ...this.getFormHeadersLocal(), ...(token && { token }) } };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${urls.atm.userPrCurve}?${queryParams}`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    if (result?.errorcode === 'NOT_LOGGEDIN' || result?.failed) {
      const newToken = await this.authService.authenticate(walletProvider);
      const retryOptions: RequestInit = { method: 'GET', headers: { ...this.getFormHeadersLocal(), token: newToken } };
      if (shouldUseCredentials()) retryOptions.credentials = 'include';
      const retryResponse = await fetch(`${urls.atm.userPrCurve}?${queryParams}`, retryOptions);
      if (!retryResponse.ok) throw new Error(`HTTP error! status: ${retryResponse.status}`);
      const retryResult = await retryResponse.json();
      return retryResult?.data || retryResult;
    }
    return result?.data || result;
  }

  async getUserAGTRecord(pageNo: number = 1, pageSize: number = 20, walletProvider?: any): Promise<{ list: any[]; agtTotal: number }> {
    const token = walletProvider ? await this.authService.getToken(walletProvider) : '';
    const queryParams = new URLSearchParams({ pageNo: pageNo.toString(), pageSize: pageSize.toString() }).toString();
    const requestOptions: RequestInit = { method: 'GET', headers: { ...this.getFormHeadersLocal(), ...(token && { token }) } };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(`${urls.atm.userAgtRecord}?${queryParams}`, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    if (result?.errorcode === 'NOT_LOGGEDIN' || result?.failed) {
      const newToken = await this.authService.authenticate(walletProvider);
      const retryOptions: RequestInit = { method: 'GET', headers: { ...this.getFormHeadersLocal(), token: newToken } };
      if (shouldUseCredentials()) retryOptions.credentials = 'include';
      const retryResponse = await fetch(`${urls.atm.userAgtRecord}?${queryParams}`, retryOptions);
      if (!retryResponse.ok) throw new Error(`HTTP error! status: ${retryResponse.status}`);
      const retryResult = await retryResponse.json();
      return { list: retryResult?.data?.list || [], agtTotal: retryResult?.data?.agtTotal || 0 };
    }
    return { list: result?.data?.list || [], agtTotal: result?.data?.agtTotal || 0 };
  }

  async fetchRankList(pageNo: number, pageSize: number = 10, type: number = 1): Promise<{ list: RankingItem[]; total: number }> {
    try {
      const config: any = {
        params: { pageNo, pageSize, type },
      };
      if (shouldUseCredentials()) config.withCredentials = true;
      const response = await axios.get(urls.atm.allNetworkRanking, config);
      if (response.data && Array.isArray(response.data.data)) {
        return {
          list: response.data.data,
          total: response.data.total ?? 0,
        };
      } else {
        console.error('Invalid response format:', response.data);
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('Error fetching rank list:', error);
      throw error;
    }
  }

  async updateNickname(nickName: string, walletProvider?: any): Promise<any> {
    const token = walletProvider ? await this.authService.getToken(walletProvider) : '';
    const params = new URLSearchParams({ nickName });
    const requestOptions: RequestInit = { method: 'POST', headers: { ...this.getFormHeadersLocal(), ...(token && { token }) }, body: params };
    if (shouldUseCredentials()) requestOptions.credentials = 'include';
    const response = await fetch(urls.atm.updateNickname, requestOptions);
    if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
    const result = await response.json();
    if (result?.errorcode === 'NOT_LOGGEDIN' || result?.failed) {
      const newToken = await this.authService.authenticate(walletProvider);
      const retryOptions: RequestInit = { method: 'POST', headers: { ...this.getFormHeadersLocal(), token: newToken }, body: params };
      if (shouldUseCredentials()) retryOptions.credentials = 'include';
      const retryResponse = await fetch(urls.atm.updateNickname, retryOptions);
      if (!retryResponse.ok) throw new Error(`HTTP error! status: ${retryResponse.status}`);
      return await retryResponse.json();
    }
    return result;
  }
}
