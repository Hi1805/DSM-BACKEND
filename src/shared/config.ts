import * as dotenv from "dotenv";
dotenv.config();
const private_key = `-----BEGIN PRIVATE KEY-----\n${process.env.PRIVATE_KEY}\n-----END PRIVATE KEY-----\n`;

export const firebaseConfig = {
  type: "service_account",
  projectId: process.env.PROJECT_ID,
  private_key_id: process.env.PRIVATE_KEY_ID,
  private_key: private_key,
  client_email: process.env.CLIENT_EMAIL,
  client_id: process.env.CLIENT_ID_FIREBASE,
  auth_uri: "https://accounts.google.com/o/oauth2/auth",
  token_uri: "https://oauth2.googleapis.com/token",
  auth_provider_x509_cert_url: process.env.AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.CLIENT_CERT_URL,
};
