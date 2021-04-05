import { currentUser, errorHandler, NotFoundError } from "@krproj/common";
import cookieSession from "cookie-session";
import express from "express";
import { createCardsRouter } from "./routes/create";
import { deleteCardRouter } from "./routes/delete";
import { getCardsRouter } from "./routes/get";
import { updateCardRouter } from "./routes/update";

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

app.use(getCardsRouter);
app.use(createCardsRouter);
app.use(updateCardRouter);
app.use(deleteCardRouter);
app.all("*", (req, res, next) => {
  next(new NotFoundError());
});
app.use(errorHandler);
export { app };
