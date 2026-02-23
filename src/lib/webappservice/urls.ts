import { API_CONFIG } from '../apiConfig';

export const urls = {
  auth: {
    getSignMessage: `${API_CONFIG.WEB_API_BASE_URL}/user/getSignMessage`,
    appLogin: `${API_CONFIG.WEB_API_BASE_URL}/user/appLogin`,
  },
  open: {
    getSignMessage: `${API_CONFIG.OPENAPI_BASE_URL}/open/getSignMessage`,
    getLoginToken: `${API_CONFIG.OPENAPI_BASE_URL}/open/getLoginToken`,
    getCurrentIncome: `${API_CONFIG.OPENAPI_BASE_URL}/open/getCurrentIncome`,
    getServerList: `${API_CONFIG.OPENAPI_BASE_URL}/open/getServerList`,
    getUserConnList: `${API_CONFIG.OPENAPI_BASE_URL}/open/getUserConnList`,
    getTreatyList: `${API_CONFIG.OPENAPI_BASE_URL}/open/getTreatyList`,
    updateLedgeStatus: `${API_CONFIG.OPENAPI_BASE_URL}/open/updateLedgeStatus`,
    getIncomeHistory: `${API_CONFIG.OPENAPI_BASE_URL}/open/getIncomeHistory`,
    getWithdrawalHistory: `${API_CONFIG.OPENAPI_BASE_URL}/open/getWithdrawalHistory`,
    getLucaWithdrawalSign: '/open/getLucaWithdrawalSign',
    getUserTreatyList: `${API_CONFIG.OPENAPI_BASE_URL}/getUserTreatyList`,
  },
  community: {
    getMyPartList: `${API_CONFIG.WEB_API_BASE_URL}/community/getMyPartList`,
    getMyInitiateList: `${API_CONFIG.WEB_API_BASE_URL}/community/getMyInitiateList`,
    withdrawAGT: `${API_CONFIG.WEB_API_BASE_URL}/community/withdrawAGT`,
    createProposal: `${API_CONFIG.WEB_API_BASE_URL}/community/createProposal`,
    getInitiateList: `${API_CONFIG.WEB_API_BASE_URL}/community/getInitiateList`,
  },
  atm: {
    getNewsList: `${API_CONFIG.WEB_API_BASE_URL}/atm/getNewsList`,
    getNewsDetail: `${API_CONFIG.WEB_API_BASE_URL}/atm/getNewsDetail`,
    getPRList: `${API_CONFIG.WEB_API_BASE_URL}/atm/getPRList`,
    getLedgeList: `${API_CONFIG.WEB_API_BASE_URL}/atm/getLedgeList`,
    treatyList: `${API_CONFIG.WEB_API_BASE_URL}/atm/treatyList`,
    contractInfo: `${API_CONFIG.WEB_API_BASE_URL}/atm/contractInfo`,
    prList: `${API_CONFIG.WEB_API_BASE_URL}/atm/prList`,
    burnTotal: `${API_CONFIG.WEB_API_BASE_URL}/atm/burnTotal`,
    getOverview: `${API_CONFIG.WEB_API_BASE_URL}/atm/getOverview`,
    emailSubscription: `${API_CONFIG.WEB_API_BASE_URL}/atm/emailSubscription`,
    userPrCoinList: `${API_CONFIG.WEB_API_BASE_URL}/atm/userPrCoinList`,
    userPrCurve: `${API_CONFIG.WEB_API_BASE_URL}/atm/userPrCurve`,
    userAgtRecord: `${API_CONFIG.WEB_API_BASE_URL}/atm/userAgtRecord`,
    allNetworkRanking: `${API_CONFIG.WEB_API_BASE_URL}/atm/allNetworkRanking`,
    updateNickname: `${API_CONFIG.WEB_API_BASE_URL}/atm/updateNickname`,
  },
  site: {
    getCoinCurrencyList: `${API_CONFIG.WEB_API_BASE_URL}/site/getCoinCurrencyList`,
    linkById: `${API_CONFIG.WEB_API_BASE_URL}/site/linkById`,
  },
  nft: {
    projectList: `${API_CONFIG.WEB_API_BASE_URL}/nft/projectList`,
    nftLinkList: `${API_CONFIG.WEB_API_BASE_URL}/nft/nftLinkList`,
    nftLinkById: `${API_CONFIG.WEB_API_BASE_URL}/nft/nftLinkById`,
    metadata: (nftAddress: string, tokenId: string) => `${API_CONFIG.WEB_API_BASE_URL}/nft/${nftAddress}/${tokenId}`,
  },
  game: {
    createProposal: `${API_CONFIG.GAME_API_BASE_URL}/game/createProposal`,
    updateProposal: `${API_CONFIG.GAME_API_BASE_URL}/game/updateProposal`,
    getProposalByUserId: `${API_CONFIG.GAME_API_BASE_URL}/game/getProposalByUserId`,
    getAllProposal: `${API_CONFIG.GAME_API_BASE_URL}/game/getAllProposal`,
    updateGameStatus: `${API_CONFIG.GAME_API_BASE_URL}/game/updateGameStatus`,
    getAllGame: `${API_CONFIG.GAME_API_BASE_URL}/game/getAllGame`,
    getGameById: `${API_CONFIG.GAME_API_BASE_URL}/game/getGameById`,
    knownRating: `${API_CONFIG.GAME_API_BASE_URL}/game/knownRating`,
    anonymousRating: `${API_CONFIG.GAME_API_BASE_URL}/game/anonymousRating`,
    invest: `${API_CONFIG.GAME_API_BASE_URL}/game/invest`,
    createBattle: `${API_CONFIG.GAME_API_BASE_URL}/game/createBattle`,
    updateBattle: `${API_CONFIG.GAME_API_BASE_URL}/game/updateBattle`,
    getStars: `${API_CONFIG.GAME_API_BASE_URL}/game/getStars`,
  },
  agf: {
    getProposal: () => `${getAGFBaseURL()}/game/v2/getProposal`,
    getAllProposal: () => `${getAGFBaseURL()}/game/getAllProposal`,
    updateGameStatus: () => `${getAGFBaseURL()}/game/updateGameStatus`,
    createProposal: () => `${getAGFBaseURL()}/game/v2/createProposal`,
    updateProposal: () => `${getAGFBaseURL()}/game/updateProposal`,
  },
};

export function getAGFBaseURL(): string {
  const AGF_BASE_URL = import.meta.env.VITE_AGF_PROPOSAL_PATH;
  return AGF_BASE_URL || '';
}
