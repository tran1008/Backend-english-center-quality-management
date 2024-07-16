import express from 'express'
import ClassesController from './classes.controller.js'
import {
    createAttendance,
    deleteAttendance,
    getAttendances
} from '../studentStatictics/attendance.controller.js'
import {
    createHomework,
    deleteHomework,
    getHomeworks
} from '../studentStatictics/homework.controller.js'
import {
    createTest,
    deleteTest,
    getTests
} from '../studentStatictics/tests.controller.js'
const classRoute = express.Router()

classRoute.route('/:classId/attendances')
    .post(createAttendance)
    .get(getAttendances)
    .delete(deleteAttendance)

classRoute.route('/:classId/homework')
    .post(createHomework)
    .get(getHomeworks)
    .delete(deleteHomework)

classRoute.route('/:classId/tests')
    .post(createTest)
    .get(getTests)
    .delete(deleteTest)


classRoute.route("/").get(ClassesController.getAllClasses);
classRoute.route("/find").get(ClassesController.findClasses);
classRoute.route("/get-class-info/:id").get(ClassesController.getClassInfoByClass);
classRoute.route("/").post(ClassesController.createClasses);
classRoute.get("/:id", ClassesController.getClassesById);
classRoute.get("/teacherid/:id", ClassesController.getClassesByTeacherID);
classRoute.put("/:id", ClassesController.updateClasses);
classRoute.delete("/:id", ClassesController.deleteClasses);

export default classRoute
