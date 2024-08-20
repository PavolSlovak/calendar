import { createContext, ReactNode, useContext, useReducer } from "react";
import { User } from "../dummy_users";

type AuthState = {
  users: User[];
  currentUser: User | null;
};
type AuthContextType = AuthState & {
  login: () => void;
  logout: () => void;
};
type LoginAction = {
  type: "LOGIN";
  payload: {
    username: string;
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
        user: state.users.find((u) => u.username === action.payload.username),
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
  function login() {
    dispatch({
      type: "LOGIN",
      payload: { username: "test", password: "test" },
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
