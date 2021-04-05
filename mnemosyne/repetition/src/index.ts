import express from "express";

const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello from repetiotion");
});
app.listen(3002, () => {
  console.log("version 21");
  console.log("listening on port 3002");
});
