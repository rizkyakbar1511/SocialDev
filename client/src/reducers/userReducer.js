export const initialState = null;

export const reducer = (state, action) => {
  const { type, payload } = action;
  if (type === "USER") {
    return payload;
  }
  if (type === "CLEAR") {
    return null;
  }
  if (type === "UPDATE") {
    return {
      ...state,
      followers: payload.followers,
      following: payload.following,
    };
  }
  if (type === "UPDATEPIC") {
    return {
      ...state,
      pic: payload,
    };
  }
  return state;
};
