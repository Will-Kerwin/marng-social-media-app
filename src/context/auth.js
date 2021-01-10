import React, { useReducer, createContext } from "react";
import jwtDecode from "jwt-decode";

const initialState = {
    user:null
}


// checks local storage for token of authenticated user
if(localStorage.getItem("token")){
    const decodedToken = jwtDecode(localStorage.getItem("token"));

    if(decodedToken.exp * 1000 < Date.now() ){
        localStorage.removeItem("token");
    }else{
        initialState.user = decodedToken;        
    }
}

// creates context
const AuthContext = createContext({
  user: null,
  login: (userData) => {},
  logout: () => {},
});

// reducer which edits context based on payload
function authReducer(state, action) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
      };
    default:
      return state;
  }
}

function AuthProvider(props) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // if login successfull or token found update context
  function login(userData) {
      localStorage.setItem("token", userData.token);
    dispatch({
      type: "LOGIN",
      payload: userData,
    });
  }

  // remove token from local and context
  function logout() {
      localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  }

  // returns a provider
  return (
    <AuthContext.Provider
      value={{ user: state.user, login, logout }}
      {...props}
    />
  );
}


export { AuthContext, AuthProvider}