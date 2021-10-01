import * as dotenv from "dotenv";
import { toString } from "lodash";
dotenv.config();
const private_key =
  "-----BEGIN PRIVATE KEY-----\nMIIEugIBADANBgkqhkiG9w0BAQEFAASCBKQwggSgAgEAAoIBAQDFIzaZn9A5iSSO\nncay0tNDUF7plqa6FV0VoucAD+EZuGbTP1Uz49xx5ZfwGno0boQwlpUSSNzcAh/a\nux4MaLpwDt7XDqT00pxkI/e9ArioQ7HiPwDGzsRrNmhatxmpPCMy+sUQMdpZMS8x\nKCQ+WEQKgXyS5KptHcF3PFqHt+ibd0bxKU2tiIdL3ywxFn5SOqC2UQmgCyM2N+0n\nDRxIz2eI9vZJl8u7NeGLW0LTuWEim5HQkYxaEGtuacRGko0iv2KI+Aiq8f9H7k9x\nq/gLDDAD+Q/XdvITZA6J3vYZCuRfMTVz7TKAqA2RN5ig+jrDiq6MGRwD7iG5LlIH\neUrjTfItAgMBAAECgf8b6pA34/mOcDSDTO+e0iMj8Hdyuho4NGPLr/e5Ro9yLwaJ\nZMgMSbgudmyY/QcoY1ePu7WdoK0C2e1Hc0fTtO7NCHkZOqJwsJH/JoM8tX0qhBoD\nzMq/gLfX07u4cLsDGQNI+xEzJF+I8FHIsLgWkdqI2vYZihP+Mmb02+L80/i+iduf\nkHDhSd5tH4qLdXoDbSr3otg737Uhf0ejUSv132gycUXj+Ch9W8qr6h6NZ3+evb/U\nz4NvIJw74SFHgnks7Y+dBa4qq9b6Lk8npMnNAZTkvnRdu12Lv5UerfABG6OJPokD\n56FeOXi5PvMXlJ/fdE3WBZYyhKFmYb24WNXG2R8CgYEA7Ac+9OL5GVVMeWjr80e+\nYD7RzZgkV3ZYITft1ZX1t4jl7IzXrOt2tjMBvJK3146cW1fgBNK/4uxs+PFgfz7e\nf1Bk0esm6Ev/anJUwV+OJDnn88KJu48KAzHmRdhiRLTkbuea9L779xaqej3BO9P0\nlGhU+pWC1COtWB4mOdUFKqcCgYEA1dGH57rhAW2VVYtkSpafJ7hXqS+KeIn3VK6C\nE7axSOU5/psS9Dsdk66p/dEiTJHV29hyKkfT9ClqLfsYXdqbmdAgF1NKz1mmoVJp\nxONf6VB4Q4SgnkLeXxOhO0gOKbF/6/3rIb0yrDOuJDfr2bTxb2wssd2qWvFP7Hl/\nQ+zumwsCgYBKD2v9w0qOXGmGnxmKWLSv1oZWkKq2lvfIVJhYMJnNYTNkKj1ykN/L\nA+5DkXYGOUVulABDAy4asjzvUC4LP1rpb/xyseqfcVlPuVhG5Qjg7RqPLjexlox5\nvCqZN/B9xpT3B81jhpnhSkdr2/zKHRPdjW88wbUvg5Jc1/j+pIzeeQKBgDjKmX1s\nPp1BfPumtXG2Rfmn1ejDDtVrV70vSK9xw+7nq5q7l7I1DWsPZmlbJfAOgC4PdGtU\nfrCIW4JxAgzTpqaZCB0J64Hdfwu0NxGrjusKi5brYDoI6sV4EkgLoG9kjOSiodRp\nS08/vs4x6Dv/+mys38YyaTAUjjTyJGJnSQz3AoGAZ5zGnfO6yAbi5fBpvyU9y0/b\nTbUCwTvT0Ywlxh5Z1Mv6tQNsurbAXNdB9kvmDxm1Ly0XCOuGz6dc6CMzeO+AsRGa\nJdj4oRrKb55lpwqgE6phla532Jxn6ntdw1osNagtnPjYykXcY39zJloSeahVI4Vz\n1AWSTzGUuBs+TbOWYQ0=\n-----END PRIVATE KEY-----\n";

export const firebaseConfig = {
  type: "service_account",
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
