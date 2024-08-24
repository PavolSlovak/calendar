import Calendar from "./components/pages/Calendar";
import { Route, Routes } from "react-router-dom";
import Root from "./components/pages/Root";
import Home from "./components/pages/Home";
import Auth from "./components/pages/Auth/Auth";
import Profile from "./components/pages/Profile";
import PrivateRoute from "./components/Navigation/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute element={<Root />} />}>
        <Route index={true} element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/teams" element={<h1>Teams</h1>} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<h1>404</h1>} />
      </Route>
      <Route path="/auth" element={<Auth />} />
    </Routes>
  );
}

export default App;
