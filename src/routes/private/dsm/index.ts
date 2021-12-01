import * as express from "express";
import DSMController from "../../../controllers/DSM-controller";
const DSMRouter = express.Router();
DSMRouter.post("/send-email", DSMController.sendEmail);
DSMRouter.post("/change-password", DSMController.changePassword);
export { DSMRouter };
