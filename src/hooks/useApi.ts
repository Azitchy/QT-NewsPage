import { useState, useCallback } from 'react';
import * as gameApi from '../lib/gameApi';
import * as webApi from '../lib/webApi';

// Generic hook for API calls
export const useApiCall = <T = any, P = any>(apiFunction: (params: P) => Promise<T>) => {
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const execute = useCallback(async (params?: P) => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await apiFunction(params!);
      setData(result);
      return result;
    } catch (err: any) {
      const errorMessage = err.message || 'An error occurred';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  }, [apiFunction]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setLoading(false);
  }, []);

  return {
    data,
    loading,
    error,
    execute,
    reset,
  };
};

// Game API hooks
export const useCreateProposal = () => {
  return useApiCall(gameApi.createProposal);
};

export const useUpdateProposal = () => {
  return useApiCall(gameApi.updateProposal);
};

export const useGetProposalByUserId = () => {
  return useApiCall(gameApi.getProposalByUserId);
};

export const useGetAdminProposal = () => {
  return useApiCall(gameApi.getAdminProposal);
};

export const useUpdateProposalByAdmin = () => {
  return useApiCall(gameApi.updateProposalByAdmin);
};

export const useGetAllGames = () => {
  return useApiCall(gameApi.getAllGame);
};

export const useGetGameById = () => {
  return useApiCall(gameApi.getGameById);
};

export const useGameRating = () => {
  return useApiCall(gameApi.gameRating);
};

export const useGameContributed = () => {
  return useApiCall(gameApi.gameContributed);
};

// Web API hooks
export const useFetchNewsList = () => {
  return useApiCall<webApi.NewsListResponse, { pageIndex: number; pageSize: number; type: string }>(
    ({ pageIndex, pageSize, type }) => webApi.fetchNewsList(pageIndex, pageSize, type)
  );
};

export const useGetNewsDetail = () => {
  return useApiCall(webApi.getNewsDetail);
};

export const useGetInitiateList = () => {
  return useApiCall(webApi.getInitiateList);
};

export const useGetOverviewData = () => {
  return useApiCall(webApi.getOverviewData);
};

export const useSubscribe = () => {
  return useApiCall(webApi.subscribe);
};

export const useGetSignMessage = () => {
  return useApiCall(webApi.getSignMessage);
};

export const useGetLoginToken = () => {
  return useApiCall<{ data: any; isError: boolean; message: string }, { address: string; sign: string }>(
    ({ address, sign }) => webApi.getLoginToken(address, sign)
  );
};

export const useGetCoinCurrency = () => {
  return useApiCall(webApi.getCoinCurrency);
};

export const useGetUserLinkData = () => {
  return useApiCall(webApi.getUserLinkData);
};

export const useFetchConsensusContractList = () => {
  return useApiCall<any, {
    pageNo: number;
    pageSize?: number;
    linkCurrency?: string;
    chainId?: string | null;
    consensusType?: string;
    searchType?: string;
    searchKey?: string;
  }>(webApi.fetchConsensusContractList);
};

export const useFetchCoinPriceTrend = () => {
  return useApiCall<webApi.PriceTrendData[], { coinCurrency: string; type: string }>(
    ({ coinCurrency, type }) => webApi.fetchCoinPriceTrend(coinCurrency, type)
  );
};

export const useFetchSystemTime = () => {
  return useApiCall(webApi.fetchSystemTime);
};

export const useFetchRankList = () => {
  return useApiCall<{ list: webApi.RankingItem[]; total: number }, { pageNo: number; pageSize?: number; type?: number }>(
    ({ pageNo, pageSize = 10, type = 1 }) => webApi.fetchRankList(pageNo, pageSize, type)
  );
};

export const useFetchPRNodes = () => {
  return useApiCall<any, { pageNo: number; pageSize?: number; searchKey?: string; searchType?: string }>(
    ({ pageNo, pageSize = 10, searchKey, searchType }) => webApi.fetchPRNodes(pageNo, pageSize, searchKey, searchType)
  );
};

export const useFetchStakeTransactions = () => {
  return useApiCall<any, { pageNo: number; pageSize?: number; chainId?: string | null; searchKey?: string; searchType?: string }>(
    ({ pageNo, pageSize = 10, chainId = null, searchKey, searchType }) => 
      webApi.fetchStakeTransactions(pageNo, pageSize, chainId, searchKey, searchType)
  );
};

export const useFetchContractInfo = () => {
  return useApiCall(webApi.fetchContractInfo);
};