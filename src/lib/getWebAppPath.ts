export const getWebAppPath = (): string => {
    const nodeEnv = import.meta.env.VITE_NODE_ENV || 'dev';
    
    if (nodeEnv === 'prod') {
      return window.location.origin + '/v1/#/';
    }
    
    return '/webapp';
  };