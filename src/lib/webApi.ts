import axios from "axios";
import { API_CONFIG, getFormHeaders, getAuthHeaders, getTokenFromStorage } from "./apiConfig";

const shouldUseCredentials = () => {

  return !import.meta.env.DEV;
};

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

export interface ConsensusConnectionItem {
  id: string;
  userAddress: string;
  connectionAddress: string;
  totalConnectionAmount: string;
  lockupTime: string;
  connectionStatus: 'Connected' | 'Pending' | 'Waiting' | 'Cancelled' | 'Disconnected';
  connectionDetails: string;
  lockedPositionAmount: string;
  counterpartyLockedAmount: string;
  creationTime: string;
  hash: string;
  linkCurrency: string;
  consensusType: string;
  liquidatedDamage?: string;
}

export interface CreateConnectionRequest {
  connectionAddress: string;
  connectionToken: string;
  totalLockedAmount: string;
  lockedPositionProperties: string;
  lockupTime: string;
  counterpartyLockedAmount: string;
  connectionType: string;
}

export interface ConnectionDetailResponse {
  success: boolean;
  data: {
    connectionObject: string;
    lockedPositionAmount: string;
    counterpartyLockedAmount: string;
    lockupTime: string;
    creationTime: string;
    connectionDetails: string;
    hash: string;
    liquidatedDamage: string;
    connectionStatus: string;
  };
}

const base = API_CONFIG.WEB_API_BASE_URL;

/* ------------------------------------------
   News APIs
   ------------------------------------------ */
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

    const requestOptions: RequestInit = {
      method: "POST",
      headers: getFormHeaders(),
      body: params,
    };

    if (shouldUseCredentials()) {
      requestOptions.credentials = "include";
    }

    const response = await fetch(`${base}/atm/getNewsList`, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching news list:", error);
    throw error;
  }
};

export const getNewsDetail = async (newsId: string): Promise<any> => {
  try {
    const params = new URLSearchParams({ newsId });
    
    const requestOptions: RequestInit = {
      method: "POST",
      headers: getFormHeaders(),
      body: params,
    };

    if (shouldUseCredentials()) {
      requestOptions.credentials = "include";
    }

    const response = await fetch(`${base}/atm/getNewsDetail`, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching news detail:", error);
    throw error;
  }
};

export const showDefaultImageIfEmpty = (news: NewsItem): void => {
  if (!news.coverImg || news.coverImg.trim() === "") {
    news.coverImg = "/images/junkNews.png";
  }
};

/* ------------------------------------------
   Proposal APIs
   ------------------------------------------ */
export const getInitiateList = async (): Promise<any> => {
  try {
    const params = new URLSearchParams({
      pageIndex: "1",
      pageSize: "1",
    });

    const requestOptions: RequestInit = {
      method: "POST",
      headers: getFormHeaders(),
      body: params,
    };

    if (shouldUseCredentials()) {
      requestOptions.credentials = "include";
    }

    const response = await fetch(`${base}/community/getInitiateList`, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching initiate list:", error);
    throw error;
  }
};

/* ------------------------------------------
   Overview APIs
   ------------------------------------------ */
export const getOverviewData = async (): Promise<OverviewData> => {
  try {
    const config: any = {};
    if (shouldUseCredentials()) {
      config.withCredentials = true;
    }

    const response = await axios.get(`${base}/atm/overview`, config);

    return response.data.data as OverviewData;
  } catch (error) {
    console.error("Error fetching overview data:", error);
    throw error;
  }
};

/* ------------------------------------------
   Subscription API
   ------------------------------------------ */
export const subscribe = async (email: string): Promise<any> => {
  try {
    const config: any = {
      headers: getFormHeaders(),
    };

    if (shouldUseCredentials()) {
      config.withCredentials = true;
    }

    const response = await axios.post(`${base}/atm/emailSubscription`, { email }, config);

    return response.data;
  } catch (error) {
    console.error("Error subscribing:", error);
    throw error;
  }
};

/* ------------------------------------------
   Authentication APIs
   ------------------------------------------ */
export const getSignMessage = async (
  address: string
): Promise<{ data: string; isError: boolean; message: string }> => {
  try {
    const params = new URLSearchParams({ address });

    const config: any = {
      headers: getFormHeaders(),
    };

    if (shouldUseCredentials()) {
      config.withCredentials = true;
    }

    const response = await axios.post(`${base}/user/getSignMessage`, params.toString(), config);

    return {
      data: response.data?.data?.signMessage ?? "",
      isError: false,
      message: "success",
    };
  } catch (error: any) {
    console.error("Error getting sign message:", error);
    throw {
      data: "",
      isError: true,
      message: error?.message || "Failed to get sign message",
    };
  }
};

export const getLoginToken = async (
  address: string,
  sign: string
): Promise<{ data: any; isError: boolean; message: string }> => {
  try {
    const params = new URLSearchParams({
      address,
      sign,
      deviceId: API_CONFIG.DEVICE_ID.toString(),
      clientType: API_CONFIG.CLIENT_TYPE.toString(),
      clientVersion: API_CONFIG.CLIENT_VERSION.toString(),
    });

    const config: any = {
      headers: getFormHeaders(),
    };

    if (shouldUseCredentials()) {
      config.withCredentials = true;
    }

    const response = await axios.post(`${base}/user/appLogin`, params.toString(), config);

    return {
      data: response.data?.data ?? null,
      isError: false,
      message: "success",
    };
  } catch (error: any) {
    console.error("Error getting login token:", error);
    throw {
      data: null,
      isError: true,
      message: error?.message || "Failed to get login token",
    };
  }
};

/* ------------------------------------------
   Explorer APIs
   ------------------------------------------ */
export const getCoinCurrency = async (): Promise<CoinCurrency[]> => {
  try {
    const config: any = {
      headers: getFormHeaders(),
    };

    if (shouldUseCredentials()) {
      config.withCredentials = true;
    }

    const response = await axios.post(`${base}/site/getCoinCurrencyList`, {}, config);

    const responseData = response.data?.data;

    if (responseData && Array.isArray(responseData.coinCurrencyPairList)) {
      return responseData.coinCurrencyPairList.filter(
        (item: CoinCurrency) => item.aloneCalculateFlag === 1
      );
    } else {
      console.warn("coinCurrencyPairList not found or is not an array:", responseData);
      return [];
    }
  } catch (error) {
    console.error("Error fetching coin currency data:", error);
    throw error;
  }
};

export const getUserLinkData = async (): Promise<UserLinkData> => {
  try {
    const config: any = {};
    if (shouldUseCredentials()) {
      config.withCredentials = true;
    }

    const response = await axios.get(`${base}/site/getUserLinkCount`, config);
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
      chainId: chainId === "null" ? null : chainId,
      consensusType,
    };

    if (searchType && searchKey) {
      queryParams[searchType] = searchKey;
    }

    const config: any = {
      params: queryParams,
    };

    if (shouldUseCredentials()) {
      config.withCredentials = true;
    }

    const response = await axios.get(`${base}/atm/consensusContractList`, config);

    if (response.data?.errorcode === "INTERNAL_ERROR") {
      throw new Error(response.data.msg || "Internal server error");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching consensus contract list:", error);
    throw error;
  }
};

export const fetchCoinPriceTrend = async (
  coinCurrency: string,
  type: string
): Promise<PriceTrendData[]> => {
  try {
    const config: any = {
      params: {
        coinCurrency,
        type,
      },
    };

    if (shouldUseCredentials()) {
      config.withCredentials = true;
    }

    const response = await axios.get(`${base}/atm/coinPriceTrend`, config);

    return response.data?.data || [];
  } catch (error) {
    console.error("Error fetching coin price trend:", error);
    throw error;
  }
};

export const fetchSystemTime = async (): Promise<number | null> => {
  try {
    const config: any = {
      headers: getFormHeaders(),
    };

    if (shouldUseCredentials()) {
      config.withCredentials = true;
    }

    const response = await axios.post(`${base}/site/getCoinCurrencyList`, {}, config);
    return response.data?.data?.systemTime ?? null;
  } catch (error) {
    console.error("Error fetching system time:", error);
    throw error;
  }
};

export const fetchRankList = async (
  pageNo: number,
  pageSize: number = 10,
  type: number = 1
): Promise<{ list: RankingItem[]; total: number }> => {
  try {
    const config: any = {
      params: { pageNo, pageSize, type },
    };

    if (shouldUseCredentials()) {
      config.withCredentials = true;
    }

    const response = await axios.get(`${base}/atm/allNetworkRanking`, config);

    if (response.data && Array.isArray(response.data.data)) {
      return {
        list: response.data.data,
        total: response.data.total ?? 0,
      };
    } else {
      console.error("Invalid response format:", response.data);
      throw new Error("Invalid response format");
    }
  } catch (error) {
    console.error("Error fetching rank list:", error);
    throw error;
  }
};

export const fetchPRNodes = async (
  pageNo: number,
  pageSize: number = 10,
  searchKey?: string,
  searchType?: string
): Promise<any> => {
  try {
    const params: any = {
      pageNo,
      pageSize,
    };

    if (searchKey && searchType) {
      params[searchType] = searchKey;
    }

    const config: any = {
      params,
    };

    if (shouldUseCredentials()) {
      config.withCredentials = true;
    }

    const response = await axios.get(`${base}/atm/prList`, config);

    return response.data;
  } catch (error) {
    console.error("Error fetching PR nodes:", error);
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

    const config: any = {
      params,
    };

    if (shouldUseCredentials()) {
      config.withCredentials = true;
    }

    const response = await axios.get(`${base}/atm/treatyList`, config);

    return response.data;
  } catch (error) {
    console.error("Error fetching stake transactions:", error);
    throw error;
  }
};

export const fetchContractInfo = async (): Promise<{ data: any; total: number }> => {
  try {
    const config: any = {};
    if (shouldUseCredentials()) {
      config.withCredentials = true;
    }

    const response = await axios.get(`${base}/atm/contractInfo`, config);

    if (!response.data || !response.data.data) {
      throw new Error("Invalid response data");
    }

    return {
      data: response.data.data,
      total: response.data.total ?? 0,
    };
  } catch (error) {
    console.error("Error fetching contract info:", error);
    throw error;
  }
};

/* ------------------------------------------
   Consensus Connection APIs
   ------------------------------------------ */

// Get user's consensus connections with filtering
export const fetchUserConsensusConnections = async (params: {
  pageNo: number;
  pageSize?: number;
  status?: string;
  searchKey?: string;
  userAddress?: string;
}): Promise<any> => {
  try {
    const { pageNo, pageSize = 10, status, searchKey, userAddress } = params;

    const queryParams: any = {
      pageNo,
      pageSize,
      ...(status && { status }),
      ...(searchKey && { searchKey }),
      ...(userAddress && { userAddress }),
    };

    const config: any = {
      params: queryParams,
    };

    if (shouldUseCredentials()) {
      config.withCredentials = true;
    }

    const response = await axios.get(`${base}/atm/consensusContractList`, config);

    if (response.data?.errorcode === "INTERNAL_ERROR") {
      throw new Error(response.data.msg || "Internal server error");
    }

    return response.data;
  } catch (error) {
    console.error("Error fetching user consensus connections:", error);
    throw error;
  }
};

// Create new consensus connection
export const createConsensusConnection = async (data: CreateConnectionRequest): Promise<any> => {
  try {
    const params = new URLSearchParams({
      connectionAddress: data.connectionAddress,
      connectionToken: data.connectionToken,
      totalLockedAmount: data.totalLockedAmount,
      lockedPositionProperties: data.lockedPositionProperties,
      lockupTime: data.lockupTime,
      counterpartyLockedAmount: data.counterpartyLockedAmount,
      connectionType: data.connectionType,
    });

    const config: any = {
      headers: getFormHeaders(),
    };

    if (shouldUseCredentials()) {
      config.withCredentials = true;
    }

    const response = await axios.post(`${base}/atm/createConsensusConnection`, params.toString(), config);

    return response.data;
  } catch (error) {
    console.error("Error creating consensus connection:", error);
    throw error;
  }
};

// Get connection details by ID
export const getConsensusConnectionDetail = async (connectionId: string): Promise<ConnectionDetailResponse> => {
  try {
    const params = new URLSearchParams({ connectionId });

    const config: any = {
      headers: getFormHeaders(),
    };

    if (shouldUseCredentials()) {
      config.withCredentials = true;
    }

    const response = await axios.post(`${base}/atm/consensusConnectionDetail`, params.toString(), config);

    return response.data;
  } catch (error) {
    console.error("Error fetching consensus connection detail:", error);
    throw error;
  }
};

// Update connection status (approve/reject/disconnect)
export const updateConsensusConnectionStatus = async (
  connectionId: string,
  action: "approve" | "reject" | "disconnect"
): Promise<any> => {
  try {
    const params = new URLSearchParams({
      connectionId,
      action,
    });

    const config: any = {
      headers: getFormHeaders(),
    };

    if (shouldUseCredentials()) {
      config.withCredentials = true;
    }

    const response = await axios.post(`${base}/atm/updateConsensusConnectionStatus`, params.toString(), config);

    return response.data;
  } catch (error) {
    console.error(`Error ${action} consensus connection:`, error);
    throw error;
  }
};

// Search consensus connection by user address
export const searchConsensusConnectionByAddress = async (address: string): Promise<any> => {
  try {
    const config: any = {
      params: {
        pageNo: 1,
        pageSize: 50,
        searchType: 'userAddress',
        searchKey: address,
      },
    };

    if (shouldUseCredentials()) {
      config.withCredentials = true;
    }

    const response = await axios.get(`${base}/atm/consensusContractList`, config);

    return response.data;
  } catch (error) {
    console.error("Error searching consensus connection by address:", error);
    throw error;
  }
};

export const fetchUserTreatyList = async (params: {
  pageIndex: number;
  pageSize?: number;
  type: number;
  ledgeAddress: string;
  chainId?: string;
}): Promise<any> => {
  try {
    const {
      pageIndex,
      pageSize = 10,
      type,
      ledgeAddress,
      chainId
    } = params;

    const formParams = new URLSearchParams({
      pageIndex: pageIndex.toString(),
      pageSize: pageSize.toString(),
      type: type.toString(),
      ledgeAddress,
      ...(chainId && { chainId })
    });

    const config: any = {
      method: 'POST',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "Cssg-Language": "en",
        ...(getTokenFromStorage() && { token: getTokenFromStorage() })
      },
      body: formParams
    };

    if (shouldUseCredentials()) {
      config.credentials = "include";
    }

    const response = await fetch(`${base}/server/getUserTreatyList`, config);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: result.success || false,
      data: result.data || null,
      total: result.total || 0,
      message: result.msg || 'Success'
    };
  } catch (error) {
    console.error("Error fetching user treaty list:", error);
    throw error;
  }
};