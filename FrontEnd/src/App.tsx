import Calendar from "./components/pages/Calendar";
import { Route, Routes } from "react-router-dom";
import Root from "./components/Root";
import Home from "./components/pages/Home";
import Auth from "./components/pages/Auth/Auth";
import Profile from "./components/pages/Profile/Profile";
import PrivateRoute from "./components/Navigation/PrivateRoute";
import UpdateProfile from "./components/pages/Profile/UpdateProfile";
import CreateSchedule from "./components/pages/CreateSchedule";

function App() {
  return (
    <Routes>
      <Route path="/" element={<PrivateRoute element={<Root />} />}>
        <Route index={true} element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/teams" element={<CreateSchedule />} />
        <Route path="profile" element={<Profile />} />
        <Route path="update-profile" element={<UpdateProfile />} />
      </Route>
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<h1>404</h1>} />
    </Routes>
  );
}

export default App;