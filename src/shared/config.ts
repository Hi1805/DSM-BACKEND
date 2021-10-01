import * as dotenv from "dotenv";
import { toString } from "lodash";
dotenv.config();
const private_key = toString(process.env.PRIVATE_KEY).replace(/\\n/g, "\n");
export const firebaseConfig = {
  type: process.env.TYPE,
  projectId: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: private_key,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_CERT_URL,
};
