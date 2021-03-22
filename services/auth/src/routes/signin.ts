import express from "express";
const router = express.Router();
router.post("/api/users/signin", (req, res) => {
  res.send("I am signin");
});

export { router as signInRouter };
