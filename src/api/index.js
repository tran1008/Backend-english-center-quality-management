import express from 'express'
import userRoute from './user/user.route.js'
import studentRoute from './student/student.route.js';
import statisticsRoute from './studentStatictics/statistics.route.js';
import reportReportRoute from './studentReport/report.route.js'
import teacherRoute from "./teacher/teacher.route.js";
import testRoute from './tests/tests.route.js';
import classReportRoute from './classReport/classReport.route.js'
import classRoute from "./classes/classes.route.js";
import centerReportRoute from "./centerReport/centerReport.route.js";
import forgotPassword from './Email/ForgotEmail.route.js';
const router = express.Router();

router.use("/user", userRoute);
router.use("/statistics", statisticsRoute);
router.use("/students", studentRoute);
router.use("/student-report", reportReportRoute)
router.use("/class-report", classReportRoute);
router.use("/center-report", centerReportRoute);
router.use("/teacher", teacherRoute);
router.use("/tests", testRoute)
router.use("/class", classRoute);
router.use("/email", forgotPassword);

export default router