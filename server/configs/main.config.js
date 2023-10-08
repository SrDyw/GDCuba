import {config} from 'dotenv';

config();


export const mainConfig = {
    origin:'https://srdyw.github.io',
    PORT: process.env.PORT || 3000
}