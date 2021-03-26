import axios from "axios";
import Router from "next/router";
import { useState } from "react";
export default () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState([]);
  const signupHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/users/signup", {
        email,
        password,
      });
      Router.push("/");
    } catch (error) {
      console.log(error);
      setErrors(error.response.data.errors);
    }
  };
  return (
    <form className="container" onSubmit={signupHandler}>
      <h1>Sign Up</h1>
      <div className="form-group">
        <label>Email Address</label>
        <input
          type="email"
          className="form-control"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="form-group">
        <label>Password</label>
        <input
          type="password"
          className="form-control"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button className="btn btn-primary">Sign Up</button>
      {errors.length > 0 && (
        <div className="alert alert-danger my-4">
          <ul>
            {errors.map((error, index) => (
              <li key={index.toString()}>{error.message}</li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
};
