import express from 'express'
import {
    createAttendance,
    createAttendanceByScanning,
    deleteAttendance,
    getAttendances
} from './attendance.controller.js'
import {
    createHomework,
    deleteHomework,
    getHomeworks
} from './homework.controller.js'
import {
    createTest,
    deleteTest,
    getTests
} from './tests.controller.js'
const statisticsRoute = express.Router()

statisticsRoute.route('/attendances/:classId')
    .post(createAttendance)
    .get(getAttendances)
    .delete(deleteAttendance)

statisticsRoute.route("/attendances/:classId/scan").post(createAttendanceByScanning);

statisticsRoute.route('/homework/:classId')
    .post(createHomework)
    .get(getHomeworks)
    .delete(deleteHomework)

statisticsRoute.route('/tests/:classId')
    .post(createTest)
    .get(getTests)
    .delete(deleteTest)

export default statisticsRoute