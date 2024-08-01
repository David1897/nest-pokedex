export const EnvConfiguration = () => ({
  environment: process.env.NODE_ENV || 'DEV',
  mongodb: process.env.MONGODB,
  port: process.env.PORT || 3001,
  defaultlimit: +process.env.DEFAULT_LIMIT || 7,
});
