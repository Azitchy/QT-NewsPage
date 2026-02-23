import axios from "axios";
import { API_CONFIG, getFormHeaders, getAuthHeaders, getTokenFromStorage } from "./apiConfig";

const shouldUseCredentials = () => {
  return !import.meta.env.DEV;
};

const base = API_CONFIG.WEB_API_BASE_URL;

/* ------------------------------------------
   Type Definitions
   ------------------------------------------ */

// News Types
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

// Overview Types
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

// Currency Types - Updated to match actual API response
export interface CoinCurrency {
  id: number;
  aloneCalculateFlag: number;
  aloneRewardAmount: number;
  amountLimit: number;
  asc: string;
  baseCurrency: string;
  chainId: number;
  coefficient: number;
  contractAddress: string;
  createAtStr: string;
  createTime: number;
  currencyKey: string;
  currencyLogo: string;
  currencyName: string;
  currencyNetStr: string;
  gateWay: string;
  ids: any[];
  lockAmount: number;
  netRewardAmount: number;
  nowPrice: number;
  numPlaces: number;
  pairType: number;
  pricePlaces: number;
  rewardEndTime: number | null;
  rewardStartTime: number | null;
  showPrice: number;
  status: number;
  statustwo: string;
  tradeCurrency: string;
  updateAtStr: string;
  updateTime: number;
  weiPlaces: string;
  
  // Optional fields for backward compatibility
  name?: string;
  symbol?: string;
  linkCurrency?: string;
  quoteCurrency?: string;
  price?: number;
  pre?: string;
  totalAmount?: number;
  count?: number;
  address?: string;
}

// User Link Data Types
export interface UserLinkData {
  data: {
    linkList: Array<{
      linkCurrency: string;
      userCount: number;
      linkCount: number;
    }>;
    userTotal: number;
    linkTotal: number;
  };
}

// Price Trend Types
export interface PriceTrendData {
  info: {
    nowPrice: number;
    pre: string;
    totalAmount: string;
    count: number;
    address: string;
  };
  x: string[];
  y: number[];
}

// Ranking Types
export interface RankingItem {
  rank: number;
  address: string;
  totalAmount: number;
}

export interface ConsensusConnectionItem {
  amount: number;
  chainNetWork: string;
  contractAddress: string;
  createAddress: string;
  createHash: string;
  createLockNft: string;
  createTime: number;
  linkAddress: string;
  linkCurrency: string;
  linkStatus: number; // 1=Waiting, 2=Connected, 3=Pending, 4=Cancelled, 5=Disconnected
  lockFlag: number;
  lockedDay: number;
  nftAddress: string;
  nftName: string;
  targetAddress: string;
  targetLockNft: string;
}

export interface ApiResponse<T> {
  data: T;
  errorcode: string;
  failed: boolean;
  mapData: null;
  msg: string;
  state: string;
  status: string;
  success: boolean;
  total: number;
}

export interface ConsensusConnectionListResponse {
  list: ConsensusConnectionItem[];
  total: number;
}

export interface FetchConnectionsParams {
  pageNo: number;
  pageSize: number;
  status?: string;
  userAddress?: string;
}

export interface CreateConnectionRequest {
  connectionAddress: string;
  connectionToken: string;
  totalLockedAmount: string;
  lockedPositionProperties?: string;
  lockupTime: string;
  counterpartyLockedAmount: string;
  connectionType: string;
}

export interface ConnectionDetailResponse {
  connectionObject: string;
  lockupTime: string;
  lockedPositionAmount: number;
  creationTime: number;
  counterpartyLockedAmount: number;
  connectionDetails: string;
  hash: string;
  liquidatedDamage: number;
  status: number;
}

// Status mapping
const STATUS_MAP: Record<string, number> = {
  'Waiting': 1,
  'Connected': 2,
  'Pending': 3,
  'Cancelled': 4,
  'Disconnected': 5
};

const REVERSE_STATUS_MAP: Record<number, string> = {
  1: 'Waiting',
  2: 'Connected',
  3: 'Pending',
  4: 'Cancelled',
  5: 'Disconnected'
};

// Helper function to get auth token
const getAuthToken = (): string => {
  // Get token from localStorage or your auth system
  return localStorage.getItem('apiToken') || '';
};




// Export status mapping utilities
export const getStatusString = (statusNumber: number): string => {
  return REVERSE_STATUS_MAP[statusNumber] || 'Unknown';
};

export const getStatusNumber = (statusString: string): number => {
  return STATUS_MAP[statusString] || 1;
};


// PR Node Types
export interface PRNodeItem {
  serverAddress: string;
  serverUrl: string;
  serverIp: string;
  serverNickname: string;
  ledgeAmount: string;
  rank?: number;
}

// Stake Transaction Types
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

// Contract Info Types
export interface ContractInfoItem {
  name: string;
  nameEn: string;
  address: string;
  transactions: number;
  balance: string;
  lastBlock: string;
  type: number;
}

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

export const fetchCoinPriceTrend = async (
  coinCurrency: string,
  type: string
): Promise<PriceTrendData> => {
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
    return response.data?.data || { info: { nowPrice: 0, pre: "0", totalAmount: "0", count: 0, address: "" }, x: [], y: [] };
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

/* ------------------------------------------
   Ranking APIs
   ------------------------------------------ */
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

/* ------------------------------------------
   Consensus Connection APIs
   ------------------------------------------ */
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

export const createConsensusConnection = async (data: CreateConnectionRequest): Promise<any> => {
  try {
    const params = new URLSearchParams();
    params.append('connectionAddress', data.connectionAddress);
    params.append('connectionToken', data.connectionToken);
    params.append('totalLockedAmount', data.totalLockedAmount);
    if (data.lockedPositionProperties) {
      params.append('lockedPositionProperties', data.lockedPositionProperties);
    }
    params.append('lockupTime', data.lockupTime);
    params.append('counterpartyLockedAmount', data.counterpartyLockedAmount);
    params.append('connectionType', data.connectionType);

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

/* ------------------------------------------
   PR Node APIs
   ------------------------------------------ */
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

/* ------------------------------------------
   Stake Transaction APIs
   ------------------------------------------ */
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

/* ------------------------------------------
   Contract Info APIs
   ------------------------------------------ */
export const fetchContractInfo = async (): Promise<{ data: ContractInfoItem[]; total: number }> => {
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
   User Information API
   ------------------------------------------ */
export const fetchUserInformation = async (
  pageNo: number,
  pageSize: number = 10
): Promise<any> => {
  try {
    // Since there's no specific user info API, we'll use consensus contract list
    // and aggregate user data from it
    const config: any = {
      params: {
        pageNo,
        pageSize,
      },
    };

    if (shouldUseCredentials()) {
      config.withCredentials = true;
    }

    const response = await axios.get(`${base}/atm/consensusContractList`, config);
    
    if (response.data?.errorcode === "INTERNAL_ERROR") {
      throw new Error(response.data.msg || "Internal server error");
    }

    // Transform the data to create user information
    const users = new Map();
    const connections = response.data.data || [];
    
    connections.forEach((conn: any) => {
      const userAddress = conn.createAddress;
      if (!users.has(userAddress)) {
        users.set(userAddress, {
          userAddress,
          prValue: "0",
          consensusConnection: 0,
          connectionQuality: "0 LUCA",
          totalAmount: 0
        });
      }
      
      const user = users.get(userAddress);
      user.consensusConnection += 1;
      const amount = parseFloat(conn.amount || "0");
      user.totalAmount += amount;
      user.connectionQuality = `${user.totalAmount.toFixed(8)} ${conn.linkCurrency || 'LUCA'}`;
      // Simple PR value calculation based on total connections and amounts
      user.prValue = (user.totalAmount * user.consensusConnection / 1000).toFixed(4);
    });

    return {
      data: Array.from(users.values()),
      total: users.size,
    };
  } catch (error) {
    console.error("Error fetching user information:", error);
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
   Community APIs
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
   Contact Form Mail API
   ------------------------------------------ */

export interface ContactFormData {
  name: string;
  email: string;
  walletAddress?: string;
  message: string;
}

export const sendContactMail = async (
  formData: ContactFormData,
  token: string
): Promise<{ success: boolean; message: string }> => {
  try {
    const mailApiUrl = "https://svtest-web.kodelab.io/mail";
    
    const emailContent = `
New Contact Form Submission from ATM Website

Name: ${formData.name}
Email: ${formData.email}
Wallet Address: ${formData.walletAddress || 'Not provided'}

Message:
${formData.message}

---
Submitted at: ${new Date().toLocaleString()}
    `.trim();

    const requestBody = {
      personalizations: [
        {
          to: [
            {
              email: "jainesh@kodelab.io"
            }
          ],
          subject: "New Contact Form Submission"
        }
      ],
      from: {
        email: "info@kodelab.io",
        name: "ATM Website Contact Form"
      },
      content: [
        {
          type: "text/plain",
          value: emailContent
        }
      ]
    };

    const response = await fetch(mailApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(requestBody)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    return {
      success: true,
      message: result.message || "Email sent successfully"
    };
  } catch (error: any) {
    console.error("Error sending contact mail:", error);
    return {
      success: false,
      message: error.message || "Failed to send email. Please try again later."
    };
  }
};


/* ------------------------------------------
   NFT Connection Types
   ------------------------------------------ */

export interface NFTProject {
  id: number;
  name: string;
  address: string;
  webUrl: string;
  status: number;
}

export interface NFTLinkConnection {
  id: number;
  createAddress: string;
  targetAddress: string;
  linkAddress: string;
  createLockNft: string; // Token ID
  targetLockNft: string; // Token ID
  nftAddress: string;
  nftName: string;
  lockedDay: number;
  lockFlag: number; // 1 = both pledge, 2 = separate pledge
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

export interface NFTConnectionListParams {
  userWalletAddress?: string;
  linkStatus: number;
  pageIndex?: number;
  pageSize?: number;
  chainId?: string;
}

/* ------------------------------------------
   NFT APIs
   ------------------------------------------ */

/**
 * Get list of available NFT projects
 */
export const getNFTProjectList = async (): Promise<{ success: boolean; data: { nftProjectList: NFTProject[] } }> => {
  try {
    const requestOptions: RequestInit = {
      method: "GET",
      headers: getFormHeaders(),
    };

    if (shouldUseCredentials()) {
      requestOptions.credentials = "include";
    }

    const response = await fetch(`${base}/nft/projectList`, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching NFT project list:", error);
    throw error;
  }
};

/**
 * Get NFT connection list
 */
export const getNFTLinkList = async (params: NFTConnectionListParams): Promise<{ 
  success: boolean; 
  data: { 
    linkList: NFTLinkConnection[];
    linkCount: number;
    waitDealCount: number;
    otherDealCount: number;
  } 
}> => {
  try {
    const formParams = new URLSearchParams();
    if (params.userWalletAddress) formParams.append('userWalletAddress', params.userWalletAddress);
    formParams.append('linkStatus', params.linkStatus.toString());
    formParams.append('pageIndex', (params.pageIndex || 1).toString());
    formParams.append('pageSize', (params.pageSize || 20).toString());
    if (params.chainId) formParams.append('chainId', params.chainId);

    const requestOptions: RequestInit = {
      method: "POST",
      headers: getFormHeaders(),
      body: formParams,
    };

    if (shouldUseCredentials()) {
      requestOptions.credentials = "include";
    }

    const response = await fetch(`${base}/nft/nftLinkList`, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching NFT link list:", error);
    throw error;
  }
};

/**
 * Get NFT connection details by ID
 */
export const getNFTLinkById = async (id: number): Promise<{ 
  success: boolean; 
  data: { linkRecord: NFTLinkConnection } 
}> => {
  try {
    const formParams = new URLSearchParams();
    formParams.append('id', id.toString());

    const requestOptions: RequestInit = {
      method: "POST",
      headers: getFormHeaders(),
      body: formParams,
    };

    if (shouldUseCredentials()) {
      requestOptions.credentials = "include";
    }

    const response = await fetch(`${base}/nft/nftLinkById`, requestOptions);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();

    // Transform data to match UI expectations
    if (result.success && result.data?.linkRecord) {
      const record = result.data.linkRecord;
      const userAddress = localStorage.getItem('walletAddress'); // Get from your auth system
      
      if (userAddress && record.createAddress.toLowerCase() === userAddress.toLowerCase()) {
        record.myNft = record.createLockNft;
        if (record.lockFlag === 1) {
          record.myNft2 = record.targetLockNft;
        } else {
          record.targetNft = record.targetLockNft;
        }
      } else {
        record.targetNft = record.createLockNft;
        if (record.lockFlag === 1) {
          record.targetNft2 = record.targetLockNft;
        } else {
          record.myNft = record.targetLockNft;
        }
      }
    }

    return result;
  } catch (error) {
    console.error("Error fetching NFT link by ID:", error);
    throw error;
  }
};


export const getNFTMetadata = async (nftAddress: string, tokenId: string): Promise<any> => {
  try {
    const response = await fetch(`${base}/nft/${nftAddress}/${tokenId}`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching NFT metadata:", error);
    return null;
  }
};