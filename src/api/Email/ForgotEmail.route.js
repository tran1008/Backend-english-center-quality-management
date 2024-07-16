import express from 'express'
import ForgotEmailController from './ForgotEmail.controller.js'

const route = express.Router();

route.route("/").post(ForgotEmailController.forgotPassword);

export default route