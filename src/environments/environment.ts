const production = false;

export const environment = {
  production: production,
  apiUrl: production ? 'https://api.production.com' : 'http://localhost:3000',
};