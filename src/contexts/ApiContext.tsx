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
    // News APIs
    fetchNewsList: typeof webApi.fetchNewsList;
    getNewsDetail: typeof webApi.getNewsDetail;
    showDefaultImageIfEmpty: typeof webApi.showDefaultImageIfEmpty;
    
    // Overview & Statistics APIs
    getOverviewData: typeof webApi.getOverviewData;
    getUserLinkData: typeof webApi.getUserLinkData;
    
    // Explorer APIs
    getCoinCurrency: typeof webApi.getCoinCurrency;
    fetchCoinPriceTrend: typeof webApi.fetchCoinPriceTrend;
    fetchSystemTime: typeof webApi.fetchSystemTime;
    
    // Ranking & User APIs
    fetchRankList: typeof webApi.fetchRankList;
    fetchUserInformation: typeof webApi.fetchUserInformation;
    
    // Transaction & Node APIs
    fetchConsensusContractList: typeof webApi.fetchConsensusContractList;
    fetchPRNodes: typeof webApi.fetchPRNodes;
    fetchStakeTransactions: typeof webApi.fetchStakeTransactions;
    fetchContractInfo: typeof webApi.fetchContractInfo;
    
    // Authentication APIs
    getSignMessage: typeof webApi.getSignMessage;
    getLoginToken: typeof webApi.getLoginToken;
    
    // Subscription & Community APIs
    subscribe: typeof webApi.subscribe;
    getInitiateList: typeof webApi.getInitiateList;
  };
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
      // News APIs
      fetchNewsList: webApi.fetchNewsList,
      getNewsDetail: webApi.getNewsDetail,
      showDefaultImageIfEmpty: webApi.showDefaultImageIfEmpty,
      
      // Overview & Statistics APIs
      getOverviewData: webApi.getOverviewData,
      getUserLinkData: webApi.getUserLinkData,
      
      // Explorer APIs
      getCoinCurrency: webApi.getCoinCurrency,
      fetchCoinPriceTrend: webApi.fetchCoinPriceTrend,
      fetchSystemTime: webApi.fetchSystemTime,
      
      // Ranking & User APIs
      fetchRankList: webApi.fetchRankList,
      fetchUserInformation: webApi.fetchUserInformation,
      
      // Transaction & Node APIs
      fetchConsensusContractList: webApi.fetchConsensusContractList,
      fetchPRNodes: webApi.fetchPRNodes,
      fetchStakeTransactions: webApi.fetchStakeTransactions,
      fetchContractInfo: webApi.fetchContractInfo,
      
      // Authentication APIs
      getSignMessage: webApi.getSignMessage,
      getLoginToken: webApi.getLoginToken,
      
      // Subscription & Community APIs
      subscribe: webApi.subscribe,
      getInitiateList: webApi.getInitiateList,
    },
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