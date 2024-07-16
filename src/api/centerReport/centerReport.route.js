import express from "express";
import centerReportController from "./centerReport.controller.js";
const route = express.Router();

route.route("/").get(centerReportController.getCenterReportDailyApi);
route.route("/date").get(centerReportController.getCenterDated);
route.route("/monthly").get(centerReportController.getCenterReportMonthlyApi);
route.route("/").post(centerReportController.createUpdateCenterReportApi);

export default route;
