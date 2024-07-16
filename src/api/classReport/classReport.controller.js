import StudentReports from "../model/student-report.schema.js";
import ClassReportSchema from "../model/class-report.schema.js";
import StudentSchema from "../model/student.schema.js";
import ClassSchema from "../model/class.schema.js";
import responseTemplate from "../helpers/response.js";
import mongoose from "mongoose";
import { ObjectId } from "mongodb";

//get number information of a class
const getClassLevel = async (reportData) => {
  const studentsReports = await StudentReports.find(reportData);
  //console.log("student report:", studentsReports);
  let goodLevel = 0;
  let mediumLevel = 0;
  let badLevel = 0;
  let sumClassScore = 0;
  studentsReports.forEach((report) => {
    sumClassScore += report.TotalScore;
    if (report.TotalScore >= 80) goodLevel++;
    else if (report.TotalScore >= 65 && report.TotalScore < 80) mediumLevel++;
    else badLevel++;
  });
  let classLevel = "";
  const classScore = sumClassScore / studentsReports.length;
  if (classScore >= 80) classLevel = "Good";
  else if (classScore >= 65 && classScore < 80) classLevel = "Medium";
  else classLevel = "Bad";

  const result = {
    GoodLevel: goodLevel,
    MediumLevel: mediumLevel,
    BadLevel: badLevel,
    TotalStudent: studentsReports.length,
    ClassScore: classScore,
    ClassLevel: classLevel,
  };
  return result;
};

//get class report
async function getClassReports({
  classId = null,
  month = null,
  year = null,
  date = null,
} = {}) {
  try {
    const queries = {};
    if (classId) queries.ClassID = classId;
    if (month) {
      queries.Month = month;
      queries.Year = year;
    }
    if (date) {
      let newDate = new Date(date);

      let month = newDate.getMonth() + 1;
      let year = newDate.getFullYear();
      console.log("get4");

      console.log("date: ", month, year);
      // nextDay.setDate(date.getDate() + 1);

      queries.Month = month;
      queries.Year = year;
    }
    console.log("queries:", queries);
    const reportsDb = await ClassReportSchema.find(queries);
    return reportsDb;
  } catch (e) {
    console.log(error);
    return error.message;
  }
}

//call in backend
export async function createUpdateClassReport(classId, date) {
  try {
    if (!date || !classId) {
      throw "Date and ClassId are needed to create report!";
    }

    //find class report
    const reportData = {
      ClassID: classId,
      Date: new Date(date),
    };
    console.log("reportData: ", reportData);
    const reportDb = await ClassReportSchema.findOne(reportData);

    console.log("report check:", reportDb);

    //recaculate classNumberLevel
    const resultCaculate = await getClassLevel(reportData);

    if (!reportDb) {
      console.log("dont have report");
      //create new report
      let month = reportData.Date.getMonth() + 1;
      let year = reportData.Date.getFullYear();
      const newClassReport = await ClassReportSchema.create({
        ...reportData,
        ...resultCaculate,
        Month: month,
        Year: year,
      });
      return newClassReport;
    } else {
      console.log("have report");
      //update report
      const updatedReport = await reportDb.updateOne(resultCaculate);
      return updatedReport;
    }
  } catch (e) {
    console.log(error);
    return error.message;
  }
}

export default class classReportController {
  static async getClassReportDailyApi(req, res, next) {
    try {
      console.log("get data by date");
      const { classId, month, year, date } = req.query;
      console.log("here:", classId, month, year, date);

      let reportResponse = {};

      let reportDb = await getClassReports({
        classId,
        month,
        year,
        date,
      });
      reportResponse.reports = reportDb;
      return res
        .status(200)
        .json(responseTemplate.successResponse(reportResponse));
    } catch (error) {
      return res.json(responseTemplate.handlingErrorResponse(error));
    }
  }

  static async createUpdateReportApi(req, res, next) {
    try {
      const { date, classId } = req.body;
      const result = await createUpdateClassReport(classId, date);
      console.log("result:", result);
      res.status(200).json(responseTemplate.successResponse(result));
    } catch (e) {
      return res.json(responseTemplate.handlingErrorResponse(e));
    }
  }

  static async getClassReportMonthlyApi(req, res, next) {
    try {
      console.log("get data by month");
      const { classId } = req.query;
      if (!classId) {
        throw "classId is required";
      }
      let reports = await ClassReportSchema.aggregate([
        { $match: { ClassID: new mongoose.Types.ObjectId(classId) } },
        {
          $project: {
            Date: 1,
            Month: 1,
            Year: 1,
            ClassScore: 1,
          },
        },
        {
          $group: {
            _id: {
              Month: "$Month",
              Year: "$Year",
            },
            AvgClassScore: { $avg: "$ClassScore" },
          },
        },
      ]);
      return res.status(200).json(responseTemplate.successResponse(reports));
    } catch (e) {
      return res.json(responseTemplate.handlingErrorResponse(error));
    }
  }

  static async getClassDated(req, res, next) {
    try {
      const id = req.params.id;
      console.log("class id: ", id);
      const classDate = await ClassReportSchema.find(
        {
          ClassID: new ObjectId(id),
        },
        { Date: 1 }
      );
      const response = {};
      let months = [];
      let dates = [];
      classDate.forEach((item) => {
        const date = item["Date"];
        dates.push(date);
        const month = date.getMonth() + 1; // Lấy tháng (trả về giá trị từ 0 đến 11, nên cần cộng thêm 1 để lấy tháng từ 1 đến 12)
        const year = date.getFullYear(); // Lấy năm
        const monthString = `${month}-${year}`;
        if (!months.includes(monthString)) months.push(monthString);
      });

      response.months = months;
      response.dates = dates;
      return res.status(200).json(responseTemplate.successResponse(response));
    } catch (e) {
      return res.json(responseTemplate.handlingErrorResponse(e));
    }
  }
}
