import UserSchema from "../model/user.schema.js";

import Response from "../helpers/response.js";

export default class UserController {
  static async getAllUser(req, res, next) {
    try {
      const users = await UserSchema.find();
      if (!users) {
        throw "error";
      }

      return res.status(200).json(Response.successResponse(users));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }

  static async createUser(req, res, next) {
    try {
      //create new model
      // const newUser = {
      //   username: req.body.username,
      //   password: req.body.password,
      //   email: req.body.email,
      //   age: req.body.age,
      // };
      console.debug("Creating");
      const user = new UserSchema({
        username: req.body.username,
        password: req.body.password,
        email: req.body.email,
        age: req.body.age,
      });
      const response = await user.save();
      return res.json(Response.successResponse(response));
    } catch (error) {
      return res.json(Response.handlingErrorResponse(error));
    }
  }
}
