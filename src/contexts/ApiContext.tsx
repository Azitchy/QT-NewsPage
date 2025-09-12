import React, { createContext, useContext, ReactNode, useCallback } from 'react';
import * as gameApi from '../lib/gameApi';
import * as webApi from '../lib/webApi';

interface ApiContextType {
  // Game API methods
  gameApi: {
    createProposal: typeof gameApi.createProposal;
    updateProposal: typeof gameApi.updateProposal;
    getProposalByUserId: typeof gameApi.getProposalByUserId;
    getAdminProposal: typeof gameApi.getAdminProposal;
    updateProposalByAdmin: typeof gameApi.updateProposalByAdmin;
    getAllGame: typeof gameApi.getAllGame;
    getGameById: typeof gameApi.getGameById;
    gameRating: typeof gameApi.gameRating;
    gameContributed: typeof gameApi.gameContributed;
  };
  
  // Web API methods
  webApi: {
    fetchNewsList: typeof webApi.fetchNewsList;
    getNewsDetail: typeof webApi.getNewsDetail;
    getInitiateList: typeof webApi.getInitiateList;
    getOverviewData: typeof webApi.getOverviewData;
    subscribe: typeof webApi.subscribe;
    getSignMessage: typeof webApi.getSignMessage;
    getLoginToken: typeof webApi.getLoginToken;
    getCoinCurrency: typeof webApi.getCoinCurrency;
    getUserLinkData: typeof webApi.getUserLinkData;
    fetchConsensusContractList: typeof webApi.fetchConsensusContractList;
    fetchCoinPriceTrend: typeof webApi.fetchCoinPriceTrend;
    fetchSystemTime: typeof webApi.fetchSystemTime;
    fetchRankList: typeof webApi.fetchRankList;
    fetchPRNodes: typeof webApi.fetchPRNodes;
    fetchStakeTransactions: typeof webApi.fetchStakeTransactions;
    fetchContractInfo: typeof webApi.fetchContractInfo;
  };

  // Utility methods
  showDefaultImageIfEmpty: typeof webApi.showDefaultImageIfEmpty;
}

const ApiContext = createContext<ApiContextType | undefined>(undefined);

export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const contextValue: ApiContextType = {
    gameApi: {
      createProposal: gameApi.createProposal,
      updateProposal: gameApi.updateProposal,
      getProposalByUserId: gameApi.getProposalByUserId,
      getAdminProposal: gameApi.getAdminProposal,
      updateProposalByAdmin: gameApi.updateProposalByAdmin,
      getAllGame: gameApi.getAllGame,
      getGameById: gameApi.getGameById,
      gameRating: gameApi.gameRating,
      gameContributed: gameApi.gameContributed,
    },
    webApi: {
      fetchNewsList: webApi.fetchNewsList,
      getNewsDetail: webApi.getNewsDetail,
      getInitiateList: webApi.getInitiateList,
      getOverviewData: webApi.getOverviewData,
      subscribe: webApi.subscribe,
      getSignMessage: webApi.getSignMessage,
      getLoginToken: webApi.getLoginToken,
      getCoinCurrency: webApi.getCoinCurrency,
      getUserLinkData: webApi.getUserLinkData,
      fetchConsensusContractList: webApi.fetchConsensusContractList,
      fetchCoinPriceTrend: webApi.fetchCoinPriceTrend,
      fetchSystemTime: webApi.fetchSystemTime,
      fetchRankList: webApi.fetchRankList,
      fetchPRNodes: webApi.fetchPRNodes,
      fetchStakeTransactions: webApi.fetchStakeTransactions,
      fetchContractInfo: webApi.fetchContractInfo,
    },
    showDefaultImageIfEmpty: webApi.showDefaultImageIfEmpty,
  };

  return (
    <ApiContext.Provider value={contextValue}>
      {children}
    </ApiContext.Provider>
  );
};

export const useApi = (): ApiContextType => {
  const context = useContext(ApiContext);
  if (context === undefined) {
    throw new Error('useApi must be used within an ApiProvider');
  }
  return context;
};