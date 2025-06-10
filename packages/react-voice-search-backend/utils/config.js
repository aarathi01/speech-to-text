import dotenv from "dotenv";
import fs from "fs";

const env = process.env.NODE_ENV || "dev";
const envFile = `${env}.env`;

dotenv.config();
if (fs.existsSync(envFile)) {
  dotenv.config({ path: envFile, override: true });
  console.log(`Loaded environment variables from ${envFile}`);
} else {
  console.warn(`Env file ${envFile} not found. Using default .env values`);
}

export const BASE_URL = process.env.BASE_URL;
export const SAMPLE_RATE = process.env.SAMPLE_RATE;
export const JWT_SECRET = process.env.JWT_SECRET;
export const MONGODB_URI = process.env.MONGODB_URI;
export const PORT = process.env.PORT || 5000;
