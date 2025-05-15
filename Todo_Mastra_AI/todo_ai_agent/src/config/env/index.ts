import * as dotenv from 'dotenv';
dotenv.config();

export const NODE_ENV = process.env.NODE_ENV || 'development';

export const {
    ENCRYPTION_KEY,
    GOOGLE_GENERATIVE_AI_API_KEY,
    BASE_URL
}=process.env;