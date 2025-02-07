import dotenv from 'dotenv';
import fs from 'fs';

const envFile = {
    production: '.env.prod',
    development: '.env.dev',
    test: '.env.test'
}[process.env.NODE_ENV];

const envPath = fs.existsSync(envFile) ? envFile : '.env';

console.log(`Cargando archivo de entorno: ${envPath}`);

dotenv.config({
    path: envPath,
    override: true
});

export const config = {
    PORT: process.env.PORT || 3000,
    MONGO_URL: process.env.MONGO_URL,
    DB_NAME: process.env.DB_NAME,
    SECRET: process.env.SECRET, 
    GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
    GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET
};