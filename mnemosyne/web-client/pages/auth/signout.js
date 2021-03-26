import axios from "axios";
import Router from "next/router";
import { useEffect } from "react";

const signOutHandler = async () => {
  await axios.post("/api/users/signout");
};
export default () => {
  useEffect(async () => {
    await signOutHandler();
    Router.push("/");
  }, []);

  return <div>signig outt</div>;
};
