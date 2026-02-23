// Re-export types
export * from './types';

// Import service classes
import {
  EncryptionService,
  AuthenticationService,
  WithdrawalService,
  CommunityProposalService,
  ConsensusConnectionService,
  ConnectionCreationService,
  IncomeService,
  GameService,
  AuthorizationService,
  RecoveryPlanService,
  AGFGameProposalService,
  LinkConnectionService,
  CrosschainService,
} from './services';

import { WebAPIService } from './webapi';

// Instantiate services in dependency order
export const encryptionService = new EncryptionService();
export const authService = new AuthenticationService();
export const withdrawalService = new WithdrawalService(authService);
export const proposalService = new CommunityProposalService(authService);
export const connectionService = new ConsensusConnectionService(authService);
export const connectionCreationService = new ConnectionCreationService(authService);
export const incomeService = new IncomeService(authService, encryptionService);
export const gameService = new GameService();
export const webAPIService = new WebAPIService(authService);
export const authorizationService = new AuthorizationService();
export const recoveryPlanService = new RecoveryPlanService();
export const agfGameProposalService = new AGFGameProposalService();
export const linkConnectionService = new LinkConnectionService(authService);
export const crosschainService = new CrosschainService();

export const WebAppService = {
  encryption: encryptionService,
  auth: authService,
  withdrawal: withdrawalService,
  proposal: proposalService,
  connection: connectionService,
  income: incomeService,
  game: gameService,
  webAPI: webAPIService,
  connectionCreation: connectionCreationService,
  authorization: authorizationService,
  recoveryPlan: recoveryPlanService,
  agfGameProposal: agfGameProposalService,
  linkConnection: linkConnectionService,
  crosschain: crosschainService,
};

export default WebAppService;
