import axios from 'axios';
import { API_CONFIG, getFormHeaders, getAuthHeaders } from './apiConfig';

// Configure axios defaults
axios.defaults.withCredentials = true;

// Types
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
  totalUsers: number;
  totalTransactions: number;
  totalValue: string;
  networkHealth: number;
}

export interface CoinCurrency {
  id: string;
  name: string;
  symbol: string;
  price: number;
  change24h: number;
  marketCap: number;
  aloneCalculateFlag: number;
}

export interface UserLinkData {
  totalLinks: number;
  activeLinks: number;
  totalValue: string;
}

export interface ConsensusContract {
  id: string;
  address: string;
  chainId: string;
  consensusType: string;
  linkCurrency: string;
  status: string;
  createdAt: string;
}

export interface PriceTrendData {
  timestamp: number;
  price: number;
  volume: number;
}

export interface RankingItem {
  rank: number;
  address: string;
  value: number;
  percentage: number;
}

export interface PRNode {
  id: string;
  address: string;
  prValue: number;
  status: string;
  lastActive: string;
}

export interface StakeTransaction {
  id: string;
  address: string;
  amount: number;
  chainId: string;
  status: string;
  createdAt: string;
}

export interface ContractInfo {
  totalContracts: number;
  activeContracts: number;
  totalValue: string;
}

// News APIs
export const fetchNewsList = async (
  pageIndex: number = 1,
  pageSize: number = 10,
  type: string = ""
): Promise<NewsListResponse> => {
  try {
    const params = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      type: type.toString(),
    });

    const requestOptions = {
      method: "POST",
      credentials: "include" as RequestCredentials,
      headers: getFormHeaders(),
      body: params,
    };

    const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/atm/getNewsList`, requestOptions);
    return await response.json();
  } catch (error) {
    console.error("Error fetching news list:", error);
    throw error;
  }
};

export const getNewsDetail = async (newsId: string): Promise<any> => {
  try {
    const params = new URLSearchParams({
      newsId
    });

    const requestOptions = {
      method: "POST",
      credentials: "include" as RequestCredentials,
      headers: getFormHeaders(),
      body: params,
    };

    const response = await fetch(`${API_CONFIG.WEB_API_BASE_URL}/atm/getNewsDetail`, requestOptions);
    return await response.json();
  } catch (error) {
    console.error("Error fetching news detail:", error);
    throw error;
  }
};

export const showDefaultImageIfEmpty = (news: NewsItem): void => {
  if (!news.coverImg || news.coverImg.trim() === "") {
    news.coverImg = "/placeholder.png";
  }
};

// Proposal APIs
export const getInitiateList = async (): Promise<any> => {
  try {
    const params = new URLSearchParams({
      pageIndex: "1",
      pageSize: "1",
    });

    const requestOptions = {
      method: "POST",
      credentials: "include" as RequestCredentials,
      headers: getFormHeaders(),
      body: params.toString(),
    };

    const response = await fetch(
      `${API_CONFIG.WEB_API_BASE_URL}/community/getInitiateList`,
      requestOptions
    );
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error("Error fetching initiate list:", error);
    throw error;
  }
};

// Overview APIs
export const getOverviewData = async (): Promise<OverviewData> => {
  try {
    const response = await axios.get(`${API_CONFIG.WEB_API_BASE_URL}/atm/overview`, {
      withCredentials: true,
    });

    return response.data.data;
  } catch (error) {
    console.error("Error fetching overview data:", error);
    throw error;
  }
};

// Subscription API
export const subscribe = async (email: string): Promise<any> => {
  try {
    const response = await axios.post(
      `${API_CONFIG.WEB_API_BASE_URL}/atm/emailSubscription`,
      { email },
      {
        headers: getFormHeaders(),
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error subscribing:", error);
    throw error;
  }
};

// Authentication APIs
export const getSignMessage = async (address: string): Promise<{ data: string; isError: boolean; message: string }> => {
  try {
    const response = await axios.post(
      `${API_CONFIG.WEB_API_BASE_URL}/user/getSignMessage`,
      { address },
      {
        headers: getFormHeaders(),
      }
    );

    return {
      data: response.data.data.signMessage,
      isError: false,
      message: "success",
    };
  } catch (error: any) {
    console.error("Error getting sign message:", error);
    throw {
      data: "",
      isError: true,
      message: error.message || "Failed to get sign message",
    };
  }
};

export const getLoginToken = async (address: string, sign: string): Promise<{ data: any; isError: boolean; message: string }> => {
  try {
    const response = await axios.post(
      `${API_CONFIG.WEB_API_BASE_URL}/user/appLogin`,
      {
        address,
        sign,
        deviceId: API_CONFIG.DEVICE_ID,
        clientType: API_CONFIG.CLIENT_TYPE,
        clientVersion: API_CONFIG.CLIENT_VERSION,
      },
      {
        headers: getFormHeaders(),
      }
    );

    return {
      data: response.data.data,
      isError: false,
      message: "success",
    };
  } catch (error: any) {
    console.error("Error getting login token:", error);
    throw {
      data: null,
      isError: true,
      message: error.message || "Failed to get login token",
    };
  }
};

// Explorer APIs
export const getCoinCurrency = async (): Promise<CoinCurrency[]> => {
  try {
    const response = await axios.post(`${API_CONFIG.WEB_API_BASE_URL}/site/getCoinCurrencyList`, {
      withCredentials: true,
    });
    
    const responseData = response.data?.data;
    
    if (responseData && Array.isArray(responseData.coinCurrencyPairList)) {
      return responseData.coinCurrencyPairList.filter((item: CoinCurrency) => item.aloneCalculateFlag === 1);
    } else {
      console.warn('coinCurrencyPairList not found or is not an array:', responseData);
      return [];
    }
  } catch (error) {
    console.error("Error fetching coin currency data:", error);
    throw error;
  }
};

export const getUserLinkData = async (): Promise<UserLinkData> => {
  try {
    const response = await axios.get(`${API_CONFIG.WEB_API_BASE_URL}/site/getUserLinkCount`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching user link data:", error);
    throw error;
  }
};

export const fetchConsensusContractList = async (params: {
  pageNo: number;
  pageSize?: number;
  linkCurrency?: string;
  chainId?: string | null;
  consensusType?: string;
  searchType?: string;
  searchKey?: string;
}): Promise<any> => {
  try {
    const {
      pageNo,
      pageSize = 10,
      linkCurrency,
      chainId,
      consensusType,
      searchType,
      searchKey,
    } = params;

    const queryParams: any = {
      pageNo,
      pageSize,
      linkCurrency,
      chainId: chainId === 'null' ? null : chainId,
      consensusType,
    };

    if (searchType && searchKey) {
      queryParams[searchType] = searchKey;
    }

    const response = await axios.get(`${API_CONFIG.WEB_API_BASE_URL}/atm/consensusContractList`, {
      params: queryParams,
      withCredentials: true,
    });

    if (response.data.errorcode === "INTERNAL_ERROR") {
      throw new Error(response.data.msg || "Internal server error");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching consensus contract list:", error);
    throw error;
  }
};

export const fetchCoinPriceTrend = async (coinCurrency: string, type: string): Promise<PriceTrendData[]> => {
  try {
    const response = await axios.get(`${API_CONFIG.WEB_API_BASE_URL}/atm/coinPriceTrend`, {
      params: {
        coinCurrency,
        type,
      },
    });

    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching coin price trend:", error);
    throw error;
  }
};

export const fetchSystemTime = async (): Promise<number | null> => {
  try {
    const response = await axios.post(`${API_CONFIG.WEB_API_BASE_URL}/site/getCoinCurrencyList`);
    return response.data?.data?.systemTime || null;
  } catch (error) {
    console.error('Error fetching system time:', error);
    throw error;
  }
};

export const fetchRankList = async (pageNo: number, pageSize: number = 10, type: number = 1): Promise<{ list: RankingItem[]; total: number }> => {
  try {
    const response = await axios.get(`${API_CONFIG.WEB_API_BASE_URL}/atm/allNetworkRanking`, {
      params: { pageNo, pageSize, type },
    });

    if (response.data && Array.isArray(response.data.data)) {
      return {
        list: response.data.data,
        total: response.data.total,
      };
    } else {
      console.error('Invalid response format:', response.data);
      throw new Error('Invalid response format');
    }
  } catch (error) {
    console.error('Error fetching rank list:', error);
    throw error;
  }
};

export const fetchPRNodes = async (pageNo: number, pageSize: number = 10, searchKey?: string, searchType?: string): Promise<any> => {
  try {
    const params: any = {
      pageNo,
      pageSize,
    };

    if (searchKey && searchType) {
      params[searchType] = searchKey;
    }

    const response = await axios.get(`${API_CONFIG.WEB_API_BASE_URL}/atm/prList`, {
      params,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching PR nodes:', error);
    throw error;
  }
};

export const fetchStakeTransactions = async (
  pageNo: number,
  pageSize: number = 10,
  chainId: string | null = null,
  searchKey?: string,
  searchType?: string
): Promise<any> => {
  try {
    const params: any = {
      pageNo,
      pageSize,
      chainId: chainId || undefined,
    };

    if (searchKey && searchType) {
      params[searchType] = searchKey;
    }

    const response = await axios.get(`${API_CONFIG.WEB_API_BASE_URL}/atm/treatyList`, {
      params,
      withCredentials: true,
    });

    return response.data;
  } catch (error) {
    console.error('Error fetching stake transactions:', error);
    throw error;
  }
};

export const fetchContractInfo = async (): Promise<{ data: ContractInfo; total: number }> => {
  try {
    const response = await axios.get(`${API_CONFIG.WEB_API_BASE_URL}/atm/contractInfo`, {
      withCredentials: true,
    });
    
    if (!response.data || !response.data.data) {
      throw new Error("Invalid response data");
    }
    
    return {
      data: response.data.data,
      total: response.data.total || 0
    };
  } catch (error) {
    console.error("Error fetching contract info:", error);
    throw error;
  }
};