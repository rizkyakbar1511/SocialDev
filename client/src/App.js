import React, { useEffect, createContext, useReducer, useContext } from "react";
import Navbar from "./components/Navbar";
import Home from "./components/screens/Home";
import Signin from "./components/screens/Signin";
import Profile from "./components/screens/Profile";
import UserProfile from "./components/screens/UserProfile";
import Signup from "./components/screens/Signup";
import CreatePost from "./components/screens/CreatePost";
import SubscribesUserPosts from "./components/screens/SubscribesUserPosts";
import { BrowserRouter, Route, Switch, useHistory } from "react-router-dom";
import { reducer, initialState } from "./reducers/userReducer";
import "./App.css";

export const UserContext = createContext();

const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      history.push("/signin");
    }
  }, []);
  return (
    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/signin" component={Signin} />
      <Route exact path="/profile" component={Profile} />
      <Route path="/profile/:userid" component={UserProfile} />
      <Route path="/signup" component={Signup} />
      <Route path="/create" component={CreatePost} />
      <Route path="/myfollowingpost" component={SubscribesUserPosts} />
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;
