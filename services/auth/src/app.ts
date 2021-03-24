import cookieSession from "cookie-session";
import express from "express";
import { NotFoundError } from "./errors/notFoundError";
import { errorHandler } from "./middleware/errorHandler";
import { currentUserRouter } from "./routes/currentuser";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";

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

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);
app.all("*", (req, res, next) => {
  next(new NotFoundError());
});
app.use(errorHandler);
export { app };
