import { createContext, ReactNode, useContext, useReducer } from "react";
import { User } from "../dummy_users";
import { auth } from "../firebase";

type AuthState = {
  users: User[];
  currentUser: User | null;
};
type AuthContextType = AuthState & {
  login: (email:string, password: string) => void;
  logout: () => void;
};
type LoginAction = {
  type: "LOGIN";
  payload: {
    email: string;
    password: string;
  };
};
type LogoutAction = {
  type: "LOGOUT";
};
type AuthAction = LoginAction | LogoutAction;

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export const AuthContext = createContext<AuthContextType | null>(null);

function authReducer(state: AuthState, action: AuthAction) {
  switch (action.type) {
    case "LOGIN":
      return {
        ...state,
        user: state.users.find((u) => u.email === action.payload.email),
      };
    case "LOGOUT":
      return { ...state, user: null };
    default:
      return state;
  }
}

export default function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, {
    users: [],
    currentUser: null,
  });
  function login(email, password : ) {
    dispatch({
      type: "LOGIN",
      payload: { email: email, password: password },
    });
  }
  function logout() {
    dispatch({ type: "LOGOUT" });
  }
  const ctxValue = {
    currentUser: state.currentUser,
    login,
    logout,
  } as AuthContextType;
  return (
    <AuthContext.Provider value={ctxValue}>{children}</AuthContext.Provider>
  );
}
