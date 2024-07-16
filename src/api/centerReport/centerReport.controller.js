import ClassReportSchema from "../model/class-report.schema.js";
import TotalReportSchema from "../model/total-report.schema.js";
import responseTemplate from "../helpers/response.js";
import { response } from "express";

//get number information of a class
const getCenterLevel = async (date) => {
  try {
    const classReports = await ClassReportSchema.find({
      Date: date,
    });
    //console.log("class reports:", classReports);
    let goodLevel = 0;
    let mediumLevel = 0;
    let badLevel = 0;
    let totalStudent = 0;
    let totalClass = 0;

    let sumCenterScore = 0;

    classReports.forEach((report) => {
      goodLevel += report.GoodLevel;
      mediumLevel += report.MediumLevel;
      badLevel += report.BadLevel;
      totalStudent += report.TotalStudent;
      sumCenterScore += report.ClassScore;
      totalClass++;
    });
    let centerScore = sumCenterScore / totalClass;
    const result = {
      Date: date,
      GoodLevel: goodLevel,
      MediumLevel: mediumLevel,
      BadLevel: badLevel,
      TotalStudent: totalStudent,
      CenterScore:centerScore,
      Month: date.getMonth() + 1,
    };
    return result;
  } catch (e) {
    console.log("err get center level", e);
    return e;
  }
};

export async function createUpdateCenterReport(date) {
  try {
    if (!date) {
      throw "Date is needed to create report!";
    }
    //find the center report
    const newDate = new Date(date);
    const reportDb = await TotalReportSchema.findOne({ Date: newDate });
    console.log("reportDb: ", reportDb);

    //recaculate centerNumberLevel
    const resultCaculate = await getCenterLevel(newDate);

    if (!reportDb) {
      console.log("dont have center report");
      const newCenterReport = await TotalReportSchema.create(resultCaculate);
      return newCenterReport;
    } else {
      console.log("have center report");
      const updatedReport = await reportDb.updateOne(resultCaculate);
      return updatedReport;
    }
  } catch (e) {
    console.log("create center report error", e);
    return error.message;
  }
}

//get center report
async function getCenterReports({ month = null, date = null } = {}) {
  try {
    const queries = {};
    console.log("here");
    if (month) {
      queries.Month = month;
    }
    if (date) {
      let newDate = new Date(date);
      let month = newDate.getMonth() + 1;
      queries.Month = month;
    }
    console.log("queries:", queries);
    const reportsDb = await TotalReportSchema.find(queries);
    return reportsDb;
  } catch (e) {
    console.log(error);
    return error.message;
  }
}

export default class centerReportController {
  static async getCenterReportDailyApi(req, res, next) {
    try {
      const { date, month } = req.query;
      let reportResponse = {};

      let reportDb = await getCenterReports({
        month,
        date,
      });
      reportResponse.reports = reportDb;

      return res
        .status(200)
        .json(responseTemplate.successResponse(reportResponse));
    } catch (e) {
      console.log("error getting center report daily api", e);
      return res.json(responseTemplate.handlingErrorResponse(e));
    }
  }

  static async createUpdateCenterReportApi(req, res, next) {
    try {
      const { date } = req.body;
      console.log("date: ", date);
      const result = await createUpdateCenterReport(date);
      console.log("result:", result);
      res.status(200).json(responseTemplate.successResponse(result));
    } catch (e) {
      return res.json(responseTemplate.handlingErrorResponse(e));
    }
  }

  static async getCenterReportMonthlyApi(req, res, next){
    try{
      let reports = await TotalReportSchema.aggregate([
        {
          $project: {
            Date: 1,
            Month: 1,
            CenterScore: 1,
          },
        },
        {
          $group: {
            _id: {
              Month: "$Month",
            },
            AvgCenterScore: { $avg: "$CenterScore" },
          },
        },
      ]);
      return res.status(200).json(responseTemplate.successResponse(reports));
    }catch(error){
      return res.json(responseTemplate.handlingErrorResponse(error));
    }
  }

  static async getCenterDated(req, res, next){
    try{
      const classDate = await TotalReportSchema.find({}, { Date: 1 });
      const response = {}
      let months = []
      let dates =[]
      classDate.forEach(item => {
        const date = item["Date"]
        dates.push(date)
        const month = date.getMonth() + 1; // Lấy tháng (trả về giá trị từ 0 đến 11, nên cần cộng thêm 1 để lấy tháng từ 1 đến 12)
        const year = date.getFullYear(); // Lấy năm
        const monthString = `${month}-${year}`
        if(!months.includes(monthString))
          months.push(monthString)
      })
      
      response.months = months
      response.dates = dates
      return res.status(200).json(responseTemplate.successResponse(response));
    }catch(e){
      return res.json(responseTemplate.handlingErrorResponse(e));
    }
  }
}
