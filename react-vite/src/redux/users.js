// getting current user info including user cash balance
const GET_USER ='sessions/getUser'

const getUserInfo = (user) => ({
  type: GET_USER,
  payload : user
})

export const getUserInfoThunk= () => async (dispatch) => {
  const res = await fetch('/api/users/current');
  if (res.ok) {
      const data = await res.json();
      dispatch(getUserInfo(data));
  } else {
      const errors = await res.json();
      return errors;
  }
};

const initialState = { userInfo: null };

function userInfoReducer(state = initialState, action) {
  switch (action.type) {
    case GET_USER:
      return { ...state, userInfo: action.payload };
    default:
      return state;
  }
}

export default userInfoReducer


