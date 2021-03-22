import express from "express";
import { currentUserRouter } from "./routes/currentuser";
import { signInRouter } from "./routes/signin";
import { signOutRouter } from "./routes/signout";
import { signUpRouter } from "./routes/signup";

const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.use(currentUserRouter);
app.use(signUpRouter);
app.use(signInRouter);
app.use(signOutRouter);

app.listen(3005, () => {
  console.log("version 21");
  console.log("listening on port 3005");
});
