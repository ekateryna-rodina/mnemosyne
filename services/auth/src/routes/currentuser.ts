import express from "express";
const router = express.Router();
router.get("/api/users/currentuser", (req, res) => {
  res.send("I am userrrr");
});

export { router as currentUserRouter };
