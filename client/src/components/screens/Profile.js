import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../App";

const Profile = () => {
  const [mypics, setPics] = useState([]);
  const { state, dispatch } = useContext(UserContext);
  const [image, setImage] = useState("");
  useEffect(() => {
    fetch("/mypost", {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.error) setPics({ error: result.error });
        else setPics(result.status.myPost);
      });
  }, []);

  useEffect(() => {
    if (image) {
      const data = new FormData();
      data.append("file", image);
      data.append("upload_preset", "social_dev");
      data.append("cloud_name", "dcuyktl8e");
      fetch("https://api.cloudinary.com/v1_1/dcuyktl8e/image/upload", {
        method: "post",
        body: data,
      })
        .then((response) => response.json())
        .then((data) => {
          fetch("/updatepic", {
            method: "put",
            headers: {
              "Content-Type": "application/json",
              Authorization: "Bearer " + localStorage.getItem("jwt"),
            },
            body: JSON.stringify({ pic: data.url }),
          })
            .then((response) => response.json())
            .then((result) => {
              localStorage.setItem(
                "user",
                JSON.stringify({ ...state, pic: result.pic })
              );
              dispatch({ type: "UPDATEPIC", payload: result.pic });
            });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }, [image]);

  const changePhoto = (file) => {
    setImage(file);
  };

  return (
    <div
      style={{
        maxWidth: "975px",
        margin: "0px auto",
        padding: "30px 20px 0",
      }}
    >
      <div
        style={{
          margin: "18px 0px",
          borderBottom: "1px solid grey",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-around",
          }}
        >
          <div>
            <img
              src={state ? state.pic : "loading"}
              style={{
                width: "200px",
                maxHeight: "200px",
                borderRadius: "50%",
              }}
              alt="profile"
            />
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              width: "300px",
              justifyContent: "center",
            }}
          >
            <h4>{state ? state.name : "loading"}</h4>
            <h5>{state ? state.email : "loading"}</h5>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h6>{!mypics.error ? mypics.length : "0"} Posts</h6>
              <h6>{state ? state.followers.length : "0"} followers</h6>
              <h6>{state ? state.following.length : "0"} following</h6>
            </div>
          </div>
        </div>
        <div
          className="file-field input-field change-photo-field"
          style={{ margin: "10px" }}
        >
          <div className="btn  waves-effect waves-light #7e57c2 deep-purple darken-1">
            <span>Change Photo</span>
            <input
              type="file"
              onChange={(e) => changePhoto(e.target.files[0])}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="hidden" />
          </div>
        </div>
      </div>
      <div className="gallery">
        {!mypics.error ? (
          <>
            {mypics.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item"
                  src={item.photo}
                  alt={item.title}
                  style={{ width: "230px", height: "230px" }}
                />
              );
            })}
          </>
        ) : (
          <h5>{mypics.error}</h5>
        )}
      </div>
    </div>
  );
};

export default Profile;
