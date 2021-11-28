import express from "express";
import dotenv from "dotenv";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import cors from "cors";
import Router from "./routes";
dotenv.config();

const app = express();
const options: swaggerJsDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Library API - School Data Manamgent",
      version: "1.0.0",
      description: "One For All API ",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
        },
      },
    },

    servers: [
      {
        url: "https://data-school-mangement-01.herokuapp.com",
        description: "heroku",
      },
      {
        url: "http://localhost:4000",
        description: "localhost",
      },
    ],
  },
  apis: ["**/*.yaml"],
};
const specs = swaggerJsDoc(options);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(specs));
app.use("/api", Router);
const port = process.env.PORT || "4000";
console.log("LOADING.................");

app.listen(port, () => {
  console.log(`server listen port http://localhost:${port}/api`);
});
