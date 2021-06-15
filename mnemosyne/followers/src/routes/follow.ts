import { RequireAuth } from "@meproj/common";
import express, { NextFunction, Request, Response } from "express";
const router = express.Router();
router.post(
  "/api/follow",
  RequireAuth,
  async (req: Request, res: Response, next: NextFunction) => {
    //  read user name to follow to (u-1)
    const { userToFollow } = req.body;
    const user = req.currentUser?.id;
    // read current user name (u-2)
    // add user u-1 to following of u-2
    //  add u-2 to followers of u-1
    // publish event to inform cards and profile services
    res.status(200).send({});
  }
);

export { router as followRouter };
