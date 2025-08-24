import dotenv from "dotenv";

dotenv.config();

export const { PORT, GOOGLE_CLIENT_SECRET, GOOGLE_CLIENT_ID, BDD_SERVICE_URL } = process.env;
