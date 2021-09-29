import * as express from "express";
import * as dotenv from "dotenv";
import * as swaggerUi from "swagger-ui-express";
import * as swaggerJsDoc from "swagger-jsdoc";
import Router from "./routes";
dotenv.config();
const app = express();
const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API - School Data Manamgent",
      version: "1.0.0",
      description: "One For All API ",
    },
    servers: [
      {
        url: "http://localhost:4000",
      },
    ],
  },
  apis: ["**/*.ts"],
};
const specs = swaggerJsDoc(options);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use(Router);
const port = process.env.PORT || "4000";

app.listen(port, () => {
  console.log(`server listen port http://localhost:${port}`);
});
