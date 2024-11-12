import { Route, Routes } from "react-router-dom";
import Root from "./components/Root";
import Home from "./views/Home";
import Auth from "./views/Auth/Auth";
import Profile from "./views/Profile/Profile";
import PrivateRoute from "./components/Navigation/PrivateRoute";
import UpdateProfile from "./views/Profile/UpdateProfile";
import CreateSchedule from "./views/CreateSchedule";
import { useEffect } from "react";
import { initializeNotificationListener } from "./firebase/messaging";
import { listenForInvitationAcceptance } from "./firebase/firestore";
import { useAuth } from "./store/authContext";
import Calendar2 from "./views/Calendar2";
import { ErrorPage } from "./views/ErrorPage";

function App() {
  const { currentUser } = useAuth();

  useEffect(() => {
    initializeNotificationListener(); // Listen for incoming notifications
  }, []);
  useEffect(() => {
    if (currentUser) {
      console.log("Current user:", currentUser);
      listenForInvitationAcceptance(currentUser?.uid); // Listen for invitation acceptance
    }
  }, []);
  function NotFound() {
    throw new Error("Not Found");
    return null;
  }

  return (
    <Routes>
      <Route path="/" element={<PrivateRoute element={<Root />} />}>
        <Route index={true} element={<Home />} />
        <Route path="/calendar" element={<Calendar2 />} />
        {/*   <Route path="/teams" element={<CreateSchedule />} /> */}
        <Route path="profile" element={<Profile />} />
        <Route path="update-profile" element={<UpdateProfile />} />
      </Route>
      <Route path="/auth" element={<Auth />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default App;
