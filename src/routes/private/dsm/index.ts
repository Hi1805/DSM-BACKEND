import * as express from "express";
import DSMController from "../../../controllers/DSM-controller";
const DSMRouter = express.Router();
DSMRouter.post("/send-email", DSMController.sendEmail);
DSMRouter.post("/change-password", DSMController.changePassword);
DSMRouter.post("/history/list", DSMController.getListHistory);
DSMRouter.post("/otp", DSMController.checkingOtp);

export { DSMRouter };
