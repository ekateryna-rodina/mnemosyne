import { BadRequestError, validateRequest } from "@meproj/common";
import express, { NextFunction, Request, Response } from "express";
import { body } from "express-validator";
import jwt from "jsonwebtoken";
import { UserRegisteredEventPublisher } from "../events/publishers/userRegisteredPublisher";
import { User } from "../models/user";
import { natsWrapper } from "../natsWrapper";
const router = express.Router();
router.post(
  "/api/users/signup",
  [
    body("email").isEmail().withMessage("Email must be provided"),
    body("username").notEmpty().withMessage("Username must be provided"),
    body("password")
      .trim()
      .isLength({ min: 6, max: 20 })
      .withMessage("Password must be between 6 and 20 characters"),
  ],
  validateRequest,
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password, username } = req.body;

    try {
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        throw new BadRequestError("User already exists");
      }

      const user = User.build({ email, password, username });
      await user.save();

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
      // publish event
      await new UserRegisteredEventPublisher(natsWrapper.client).publish({
        id: user._id,
        username,
      });

      res.status(201).send(user);
    } catch (error) {
      next(error);
    }
  }
);

export { router as signUpRouter };
