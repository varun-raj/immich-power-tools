export const ENV = {
  IMMICH_URL: (process.env.IMMICH_URL || 'http://immich_server:3001') as string,
  EXTERNAL_IMMICH_URL: (process.env.EXTERNAL_IMMICH_URL || process.env.IMMICH_URL) as string,
  IMMICH_API_KEY: process.env.IMMICH_API_KEY as string,
  DATABASE_URL: (process.env.DATABASE_URL || `postgresql://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@${(process.env.DB_HOST || 'immich_postgres')}:${(process.env.DB_PORT || '5432')}/${process.env.DB_DATABASE_NAME}`),
  JWT_SECRET: process.env.JWT_SECRET as string,
};


