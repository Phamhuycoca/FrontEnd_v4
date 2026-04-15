export const getAccessToken = () => {
  return localStorage.getItem('access_token');
};

export const getRefreshToken = () => {
  return localStorage.getItem('refresh_token');
};

export const setTokens = (accessToken: string) => {
  localStorage.setItem('access_token', accessToken);
};

export const clearTokens = () => {
  localStorage.removeItem('access_token');
};
