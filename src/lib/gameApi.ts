import axios from 'axios';
import { API_CONFIG, getCommonHeaders, getAuthHeaders, getUserDataFromStorage } from './apiConfig';

// Types
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

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  isSuccess?: boolean;
}

const gameBaseUrl = API_CONFIG.GAME_API_BASE_URL;

// Game Proposal APIs
export const createProposal = async (data: Partial<GameProposal>): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(`${gameBaseUrl}/game/createProposal`, data, {
      headers: getCommonHeaders(),
      withCredentials: true,
    });
    
    return {
      message: response.data.message || 'Success',
      isSuccess: response.data.success || false,
      success: response.data.success || false,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error('Create proposal error:', error);
    return {
      message: error.response?.data?.message || 'Something went wrong',
      isSuccess: false,
      success: false,
    };
  }
};

export const updateProposal = async (data: Partial<GameProposal>): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(`${gameBaseUrl}/game/updateProposal`, data, {
      headers: getCommonHeaders(),
      withCredentials: true,
    });
    
    return {
      message: response.data.message || 'Success',
      isSuccess: response.data.success || false,
      success: response.data.success || false,
      data: response.data.data,
    };
  } catch (error: any) {
    console.error('Update proposal error:', error);
    return {
      message: error.response?.data?.message || 'Something went wrong',
      isSuccess: false,
      success: false,
    };
  }
};

export const getProposalByUserId = async (): Promise<ApiResponse<GameProposal[]>> => {
  try {
    const userData = getUserDataFromStorage();
    if (!userData?.user?.id) {
      throw new Error('User not authenticated');
    }

    const userId = userData.user.id;
    const response = await axios.post(`${gameBaseUrl}/game/getProposalByUserId`, { userId }, {
      headers: getCommonHeaders(),
      withCredentials: true,
    });
    
    return {
      data: response.data.data || [],
      isSuccess: response.data.success || false,
      success: response.data.success || false,
      message: 'Success',
    };
  } catch (error: any) {
    console.error('Get proposal by user ID error:', error);
    return {
      message: error.response?.data?.message || 'Something went wrong',
      isSuccess: false,
      success: false,
    };
  }
};

export const getAdminProposal = async (): Promise<ApiResponse<GameProposal[]>> => {
  try {
    const response = await axios.post(`${gameBaseUrl}/game/getAllProposal`, { blank: 'blank' }, {
      withCredentials: true,
      headers: getAuthHeaders(),
    });
    
    return {
      data: response.data.data || [],
      isSuccess: response.data.success || false,
      success: response.data.success || false,
      message: 'Success',
    };
  } catch (error: any) {
    console.error('Get admin proposal error:', error);
    return {
      message: error.response?.data?.message || 'Something went wrong',
      isSuccess: false,
      success: false,
    };
  }
};

export const updateProposalByAdmin = async (dataObject: any): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(`${gameBaseUrl}/game/updateGameStatus`, dataObject, {
      withCredentials: true,
      headers: getAuthHeaders(),
    });
    
    return {
      data: response.data.data || '',
      isSuccess: response.data.success || false,
      success: response.data.success || false,
      message: 'Success',
    };
  } catch (error: any) {
    console.error('Update proposal by admin error:', error);
    return {
      message: error.response?.data?.message || 'Something went wrong',
      isSuccess: false,
      success: false,
    };
  }
};

// Game APIs
export const getAllGame = async (): Promise<ApiResponse<Game[]>> => {
  try {
    const response = await axios.post(`${gameBaseUrl}/game/getAllGame`, {}, {
      headers: getCommonHeaders(),
      withCredentials: true,
    });
    
    return {
      data: response.data.data || [],
      isSuccess: response.data.success || false,
      success: response.data.success || false,
      message: 'Success',
    };
  } catch (error: any) {
    console.error('Get all games error:', error);
    return {
      message: error.response?.data?.message || 'Something went wrong',
      isSuccess: false,
      success: false,
    };
  }
};

export const getGameById = async (gameId: string): Promise<ApiResponse<Game>> => {
  try {
    const response = await axios.post(`${gameBaseUrl}/game/getGameById`, { id: gameId }, {
      headers: getCommonHeaders(),
      withCredentials: true,
    });
    
    return {
      data: response.data.data,
      isSuccess: response.data.success || false,
      success: response.data.success || false,
      message: 'Success',
    };
  } catch (error: any) {
    console.error('Get game by ID error:', error);
    return {
      message: error.response?.data?.message || 'Something went wrong',
      isSuccess: false,
      success: false,
    };
  }
};

export const gameRating = async (dataObject: GameRating): Promise<ApiResponse<any>> => {
  try {
    const token = localStorage.getItem('token');
    const apiUrl = token 
      ? `${gameBaseUrl}/game/knownRating`
      : `${gameBaseUrl}/game/anonymousRating`;

    const response = await axios.post(apiUrl, dataObject, {
      ...(token && { withCredentials: true }),
      headers: token ? getAuthHeaders() : getCommonHeaders(),
    });
    
    return {
      data: response.data.data || '',
      isSuccess: response.data.success || false,
      success: response.data.success || false,
      message: 'Success',
    };
  } catch (error: any) {
    console.error('Game rating error:', error);
    return {
      message: error.response?.data?.message || 'Something went wrong',
      isSuccess: false,
      success: false,
    };
  }
};

export const gameContributed = async (dataObject: GameInvestment): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(`${gameBaseUrl}/game/invest`, dataObject, {
      withCredentials: true,
      headers: getAuthHeaders(),
    });
    
    return {
      data: response.data.data || '',
      isSuccess: response.data.success || false,
      success: response.data.success || false,
      message: 'Success',
    };
  } catch (error: any) {
    console.error('Game investment error:', error);
    return {
      message: error.response?.data?.message || 'Something went wrong',
      isSuccess: false,
      success: false,
    };
  }
};