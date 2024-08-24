import Calendar from "./components/pages/Calendar";
import { Route, Routes } from "react-router-dom";
import Root from "./components/pages/Root";
import Home from "./components/pages/Home";
import Auth from "./components/pages/Auth/Auth";
import Profile from "./components/pages/Profile";

function App() {
  return (
    <Routes>
      <Route path={"/"} element={<Root />}>
        <Route index={true} element={<Home />} />
        <Route path="/calendar" element={<Calendar />} />
        <Route path="/teams" element={<h1>Teams</h1>} />
        <Route path="/auth" element={<Auth />} />
        <Route path="profile" element={<Profile />} />
        <Route path="*" element={<h1>404</h1>} />
      </Route>
    </Routes>
  );
}

export default App;
