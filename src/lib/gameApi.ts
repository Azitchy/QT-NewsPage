import axios from 'axios';
import { API_CONFIG, getCommonHeaders, getAuthHeaders, getUserDataFromStorage } from './apiConfig';

// Types

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

// New Game Developer APIs
export const createBattle = async (data: BattleData): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(`${gameBaseUrl}/game/createBattle`, data, {
      headers: getCommonHeaders(),
      withCredentials: true,
    });
    
    return {
      data: response.data.data || null,
      isSuccess: response.data.success || false,
      success: response.data.success || false,
      message: response.data.msg || 'Success',
      errorcode: response.data.errorcode,
      failed: response.data.failed,
      mapData: response.data.mapData,
      state: response.data.state,
      status: response.data.status,
      total: response.data.total
    };
  } catch (error: any) {
    console.error('Create battle error:', error);
    return {
      message: error.response?.data?.message || 'Something went wrong',
      isSuccess: false,
      success: false,
    };
  }
};

export const updateBattle = async (data: UpdateBattleData): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(`${gameBaseUrl}/game/updateBattle`, data, {
      headers: getCommonHeaders(),
      withCredentials: true,
    });
    
    return {
      data: response.data.data || null,
      isSuccess: response.data.success || false,
      success: response.data.success || false,
      message: response.data.msg || 'Success',
      errorcode: response.data.errorcode,
      failed: response.data.failed,
      mapData: response.data.mapData,
      state: response.data.state,
      status: response.data.status,
      total: response.data.total
    };
  } catch (error: any) {
    console.error('Update battle error:', error);
    return {
      message: error.response?.data?.message || 'Something went wrong',
      isSuccess: false,
      success: false,
    };
  }
};

export const getStars = async (data: UserStarsData): Promise<ApiResponse<any>> => {
  try {
    const response = await axios.post(`${gameBaseUrl}/game/getStars`, data, {
      headers: getCommonHeaders(),
      withCredentials: true,
    });
    
    return {
      data: response.data.data || null,
      isSuccess: response.data.success || false,
      success: response.data.success || false,
      message: response.data.msg || 'Success',
      errorcode: response.data.errorcode,
      failed: response.data.failed,
      mapData: response.data.mapData,
      state: response.data.state,
      status: response.data.status,
      total: response.data.total
    };
  } catch (error: any) {
    console.error('Get stars error:', error);
    return {
      message: error.response?.data?.message || 'Something went wrong',
      isSuccess: false,
      success: false,
    };
  }
};


// Interface for contact details
interface ContactDetail {
  name: string;
  description: string;
  link: string;
  images: string;
}

// Interface for the response
interface JoinATMResponse {
  message: string;
  isSuccess: boolean;
}

export async function submitJoinATMApplication(formData: JoinATMFormData, errorText: string = "Something went wrong"): Promise<JoinATMResponse> {
  try {
    const apiUrl = gameBaseUrl + "/game/createProposal";

    // Transform JoinATM form data to match game proposal structure
    const data = JSON.stringify({
      title: formData.projectName,
      overview: `
        <h3>Project Information</h3>
        <p><strong>Project Name:</strong> ${formData.projectName}</p>
        <p><strong>Project Token:</strong> ${formData.projectToken || 'N/A'}</p>
        <p><strong>LUCA Community:</strong> ${formData.lucaCommunity}</p>
        <p><strong>LUCA Candy Value:</strong> $${formData.lucaCandyValue || 'N/A'}</p>
        <p><strong>Project Link:</strong> <a href="${formData.projectLink}" target="_blank">${formData.projectLink}</a></p>
        ${formData.whiteBookLink ? `<p><strong>White Paper:</strong> <a href="${formData.whiteBookLink}" target="_blank">${formData.whiteBookLink}</a></p>` : ''}
        ${formData.projectMedia ? `<p><strong>Media/Blog:</strong> <a href="${formData.projectMedia}" target="_blank">${formData.projectMedia}</a></p>` : ''}
        <h3>Project Introduction</h3>
        <p>${formData.projectIntroduction}</p>
      `,
      gameplay: `
        <h3>Team & Support</h3>
        <p>${formData.teamSupport}</p>
        <h3>Contract Platform</h3>
        <p>${formData.contractPlatform}</p>
      `,
      gamesMediaModelList: [],
      connectionDetails: JSON.stringify({
        lucaCommunity: formData.lucaCommunity,
        lucaCandyValue: formData.lucaCandyValue || '0',
        applicationType: 'JOIN_ATM'
      }),
      funds: 0,
      images: '',
      video: '',
      status: 1,
      createdBy: 0, // Will be set by backend from token
      categoriesIds: ["13"], // Category for Join ATM applications
      contactDetails: [
        {
          name: "email",
          description: formData.email,
          link: formData.email,
          images: "Not found"
        },
        {
          name: "Project Link",
          description: formData.projectLink,
          link: formData.projectLink,
          images: "Not found"
        }
      ] as ContactDetail[],
      milestones: []
    });

    let config = {
      method: "post",
      maxBodyLength: Infinity,
      url: apiUrl,
      headers: getCommonHeaders(),
      data: data,
    };

    let response = await axios(config)
      .then(function (response) {
        return response.data;
      })
      .catch(function (error) {
        console.error(error);
        throw error;
      });

    let res: JoinATMResponse = {
      message: response.message || response.data || "Application submitted successfully",
      isSuccess: response.success || false,
    };

    return res;
  } catch (error) {
    console.log(error);
    let res: JoinATMResponse = {
      message: errorText,
      isSuccess: false,
    };
    return res;
  }
}