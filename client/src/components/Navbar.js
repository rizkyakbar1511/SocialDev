import React, { useContext, useRef, useEffect, useState } from "react";
import { UserContext } from "../App";
import { Link, useHistory } from "react-router-dom";
import M from "materialize-css";

const Navbar = () => {
  const searchModal = useRef(null);
  const { state, dispatch } = useContext(UserContext);
  const [search, setSearch] = useState("");
  const [userDetails, setUserDetails] = useState([]);
  const history = useHistory();
  useEffect(() => {
    M.Modal.init(searchModal.current);
  }, []);
  const renderList = () => {
    if (state) {
      return [
        <li key="1">
          <i
            data-target="search-modal"
            className="material-icons modal-trigger"
            style={{ color: "black" }}
          >
            search
          </i>
        </li>,
        <li key="2">
          <Link to="/profile">Profile</Link>
        </li>,
        <li key="3">
          <Link to="/create">Create Post</Link>
        </li>,
        <li key="4">
          <Link to="/myfollowingpost">My Following Posts</Link>
        </li>,
        <li key="5">
          <button
            className="btn #c62828 red darken-3 "
            onClick={() => {
              localStorage.clear();
              dispatch({ type: "CLEAR" });
              history.push("/signin");
              M.toast({
                html: "Cya 🙋🏻‍♂️",
                classes: "#43a047 green darken-1",
              });
            }}
          >
            Logout
          </button>
        </li>,
      ];
    } else {
      return [
        <li key="6">
          <Link to="/signin">Sign-In</Link>
        </li>,
        <li key="7">
          <Link to="/signup">Sign-Up</Link>
        </li>,
      ];
    }
  };

  const searchByFetchUsers = (query) => {
    setSearch(query);
    fetch("/search-users", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((response) => response.json())
      .then((results) => {
        setUserDetails(results.user);
      });
  };
  return (
    <nav>
      <div className="nav-wrapper white" style={{ padding: " 0px 10px" }}>
        <Link to={state ? "/" : "/signin"} className="brand-logo left">
          SocialDev
        </Link>
        <ul id="nav-mobile" className="right">
          {renderList()}
        </ul>
      </div>
      <div
        id="search-modal"
        className="modal"
        ref={searchModal}
        style={{ color: "black" }}
      >
        <div className="modal-content">
          <input
            type="text"
            value={search}
            onChange={(e) => searchByFetchUsers(e.target.value)}
            placeholder="search users . . ."
          />
          <div className="collection">
            {userDetails.map((item) => {
              return (
                <Link
                  to={
                    item._id !== state._id ? "/profile/" + item._id : "/profile"
                  }
                  onClick={() => {
                    M.Modal.getInstance(searchModal.current).close();
                    setSearch("");
                  }}
                >
                  <li className="collection-item">{item.email}</li>
                </Link>
              );
            })}
          </div>
        </div>
        <div className="modal-footer">
          <button
            className="modal-close waves-effect waves-green btn-flat"
            onClick={() => setSearch("")}
          >
            Close
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
