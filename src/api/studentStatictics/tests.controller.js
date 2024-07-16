import StudentTestSchema from "../model/student-test.schema.js";
import Response from "../helpers/response.js";
import StudentSchema from "../model/student.schema.js";
import ClassSchema from "../model/class.schema.js";
import TestSchema from "../model/test.schema.js";
import studentReportController from "../studentReport/report.controller.js";
import { createUpdateClassReport } from "../classReport/classReport.controller.js";
import { createUpdateCenterReport } from "../centerReport/centerReport.controller.js";

export const createTest = async (req, res, next) => {
    const testsReq = req.body.tests
    console.log(testsReq)
    let testsRes = []
    for( let i = 0; i < testsReq.length; i++){
      const { Score, TestID, StudentID, Date } = testsReq[i];

      const student = await StudentSchema.findById(StudentID._id);
      if (!student)
        res.json(
          Response.errorResponse(
            404,
            `Student with ID ${StudentID.StudentID} is not found`
          )
        );

      const testData = {
        StudentID: student._id,
        Date: Date,
        TestID: TestID._id,
      };
      let studentIdTemp = student._id;
      const existedTest = await StudentTestSchema.findOne(testData);
      if (!existedTest) {
        const newTest = await StudentTestSchema.create({
          ...testData,
          Score: Score,
          ClassID: student.ClassID,
        });
        await studentReportController.createStudentReport({
          date: Date,
          testScore: Score,
          studentId: studentIdTemp,
          testScoreRequired: 100
        });
        testsRes.push(newTest);
      } else {
        const updatedTest = await StudentTestSchema.updateOne(testData, {
          Score: Score,
          ClassID: student.ClassID,
        });
        await studentReportController.createStudentReport({
          date: Date,
          testScore: Score,
          studentId: studentIdTemp,
          testScoreRequired: 100
        });
        testsRes.push(updatedTest);
      }
      //create and update class report
      await createUpdateClassReport(student.ClassID, Date);
      //create and update center report
      await createUpdateCenterReport(Date);
    }
    
    return res.json(Response.successResponse(testsRes))
}

export const getTests = async (req, res, next) => {
    const {
        classId
    } = req.params

    const _class = await ClassSchema.findOne({
        ClassID: classId
    })

    if (!_class) {
        return res.json(Response.errorResponse(404, "Class not found!"))
    }

    const tests = await StudentTestSchema.find({
            ClassID: _class._id
        })
        .select("StudentID Score TestID Date")

    return res.json(Response.successResponse(tests))
}

// Delete all tests of a date of a class
export const deleteTest = async (req, res, next) => {
    const {
        classId
    } = req.params
    const {
        date
    } = req.body

    const _class = await ClassSchema.findOne({
        ClassID: classId
    })

    if (!_class) {
        return res.json(Response.errorResponse(404, "Class not found!"))
    }

    await StudentTestSchema.deleteMany({
        ClassID: _class._id,
        Date: date
    })

    return res.json(Response.successResponse())
}