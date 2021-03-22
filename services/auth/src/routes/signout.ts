import express from "express";
const router = express.Router();
router.post("/api/users/signout", (req, res) => {
  res.send("I am sign out");
});

export { router as signOutRouter };
