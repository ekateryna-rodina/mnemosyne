import express from "express";

const app = express();
app.use(
  express.urlencoded({
    extended: true,
  })
);

app.use(express.json());

// delete because we are going to fetch query service
app.get("/", (req, res) => {
  res.send("hello from cards");
});
app.get("/create", (req, res) => {
  const card = req.body;
  console.log(card);
  res.send("hello from cards create");
});
app.listen(3001, () => {
  console.log("version 21");
  console.log("listening on port 3001");
});
