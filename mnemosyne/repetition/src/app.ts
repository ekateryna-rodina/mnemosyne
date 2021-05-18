import { currentUser, errorHandler, NotFoundError } from "@meproj/common";
import cookieSession from "cookie-session";
import express from "express";
import { archiveRepetitionRouter } from "./routes/archive";
import { getRepetitionRouter } from "./routes/get";
import { startRepetitionRouter } from "./routes/start";
import { updateRepetitionRouter } from "./routes/update";

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

app.use(startRepetitionRouter);
app.use(updateRepetitionRouter);
app.use(getRepetitionRouter);
app.use(archiveRepetitionRouter);

app.all("*", (req, res, next) => {
  next(new NotFoundError());
});
app.use(errorHandler);
export { app };
