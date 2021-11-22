import * as admin from "firebase-admin";
import { firebaseConfig } from "./config";
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: "https://data-management-01-default-rtdb.firebaseio.com",
});
console.log("connect firebase is successfully");

export const db = admin.firestore();
export const auth = admin.auth();
