import express from "express";

const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello from auth");
});
app.listen(3000, () => {
  console.log("version 21");
  console.log("listening on port 3000");
});
