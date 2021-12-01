import algoliasearch from "algoliasearch";
import * as admin from "firebase-admin";
import { firebaseConfig } from "./config";
admin.initializeApp({
  credential: admin.credential.cert(firebaseConfig),
  databaseURL: "https://data-management-01-default-rtdb.firebaseio.com",
});

const client = algoliasearch(
  process.env.SEARCH_APP_ID_KEY || "",
  process.env.SEARCH_ADMIN_KEY || ""
);
console.log("connect to firebase is successfully");

export const algoliaStudent = client.initIndex("students");

export const db = admin.firestore();
