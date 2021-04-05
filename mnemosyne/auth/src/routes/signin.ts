import { BadRequestError, validateRequest } from "@krproj/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { User } from "../models/user";
import { Password } from "../utils/password";
const router = express.Router();
router.post(
  "/api/users/signin",
  [
    body("email").isEmail().withMessage("Email must be provided"),
    body("password").trim().notEmpty().withMessage("Password must be provided"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new BadRequestError("Credendials are not valid");
      }

      // check password
      const passwordMatch = await Password.match(user.password, password);
      if (!passwordMatch) {
        throw new BadRequestError("Credentials are not valid");
      }

      // generate jwt
      const userJwt = jwt.sign(
        {
          id: user._id,
          email: user.email,
        },
        process.env.JWT_KEY!
      );

      // store token in session
      req.session = {
        jwt: userJwt,
      };

      res.status(200).send(user);
    } catch (error) {
      next(error);
    }
  }
);

export { router as signInRouter };
