import { errorHandler, NotFoundError } from "@krproj/common";
import express from "express";

const app = express();
app.set("trust proxy", true);
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());
app.all("*", (req, res, next) => {
  next(new NotFoundError());
});
app.use(errorHandler);
export { app };
