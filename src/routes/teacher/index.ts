import * as express from "express";
import TeacherController from "../../controllers/teacher";
const teacherRouter = express.Router();
teacherRouter.get("/list", TeacherController.getListTeacher);
teacherRouter.get("/total", TeacherController.getTotalTeacher);
teacherRouter.post("/add", TeacherController.addTeacher);
export { teacherRouter };
