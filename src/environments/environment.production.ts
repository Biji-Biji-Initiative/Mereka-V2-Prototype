export const environment = {
  production: true,
  useMocks: false,

  apiUrl: 'https://api.mereka.io/api/v1',
  apiBaseUrl: 'https://api.mereka.io',

  appUrls: {
    auth: 'https://auth.mereka.io',
    app: 'https://app.mereka.io',
    web: 'https://mereka.io',
    admin: 'https://admin.mereka.io',
    checkout: 'https://checkout.mereka.io',
    lms: 'https://lms.mereka.io',
  },

  ssoCookieDomain: '.mereka.io',
} as const;
