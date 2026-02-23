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

export interface RecoveryTransaction {
  createTime: string;
  burnAmount?: string;
  useAmount?: string;
  hash: string;
  lockAmount?: string;
  lockCurrency?: string;
}
