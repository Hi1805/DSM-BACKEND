import * as express from "express";
import TeacherController from "../../controllers/teacher";
const teacherRouter = express.Router();
teacherRouter.get("/list", TeacherController.getListTeacher);
teacherRouter.get("/total", TeacherController.getTotalTeacher);
teacherRouter.post("/create", TeacherController.createTeacher);
teacherRouter.put("/edit", TeacherController.editTeacher);
teacherRouter.delete("/delete/:id", TeacherController.deleteTeacher);
export { teacherRouter };
