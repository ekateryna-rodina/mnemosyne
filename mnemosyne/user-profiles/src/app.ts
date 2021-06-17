import { currentUser, errorHandler, NotFoundError } from "@meproj/common";
import cookieSession from "cookie-session";
import express from "express";
import { deleteUserProfileRouter } from "./routes/deleteUserProfile";
import { getUserProfileRouter } from "./routes/getUserProfile";
import { updateUserProfileRouter } from "./routes/updateUserProfile";

const app = express();
app.set("trust proxy", true);
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);
app.use(deleteUserProfileRouter);
app.use(getUserProfileRouter);
app.use(updateUserProfileRouter);
app.all("*", (req, res, next) => {
  next(new NotFoundError());
});
app.use(errorHandler);
export { app };
