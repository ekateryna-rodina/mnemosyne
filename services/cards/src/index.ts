import express from "express";

const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

app.get("/", (req, res) => {
  res.send("hello from cards");
});
app.listen(3001, () => {
  console.log("version 21");
  console.log("listening on port 3001");
});
