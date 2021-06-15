import { currentUser, errorHandler, NotFoundError } from "@meproj/common";
import cookieSession from "cookie-session";
import express from "express";
import { followRouter } from "./routes/follow";
import { unfollowRouter } from "./routes/unfollow";

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
app.use(followRouter);
app.use(unfollowRouter);
app.all("*", (req, res, next) => {
  next(new NotFoundError());
});
app.use(errorHandler);
export { app };
