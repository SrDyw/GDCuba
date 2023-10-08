import {config} from 'dotenv';

config();


export const mainConfig = {
    origin:'http://localhost:5173',
    PORT: process.env.PORT || 3000
}