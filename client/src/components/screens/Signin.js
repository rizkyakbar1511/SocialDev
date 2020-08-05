import React, { useState, useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { UserContext } from "../../App";
import M from "materialize-css";

const Signin = () => {
  const { state, dispatch } = useContext(UserContext);
  const history = useHistory();
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const PostData = () => {
    fetch("/signin", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828 red darken-3" });
        } else {
          localStorage.setItem("jwt", data.status.token);
          localStorage.setItem("user", JSON.stringify(data.status.user));
          dispatch({ type: "USER", payload: data.status.user });
          M.toast({
            html: "Welcome 🙋🏻‍♂️",
            classes: "#43a047 green darken-1",
          });
          history.push("/");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div className="auth-wrapper">
      <div className="card auth-card input-field">
        <h2>SocialDev</h2>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="E-Mail"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
        />
        <button
          className="btn waves-effect waves-dark #7e57c2 deep-purple darken-1 "
          onClick={PostData}
        >
          Sign-In
        </button>
        <h5>
          <Link to="/signup">Don't have an account ?</Link>
        </h5>
      </div>
    </div>
  );
};

export default Signin;
