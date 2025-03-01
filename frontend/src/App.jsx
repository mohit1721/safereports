import "./App.css";
import { Route, Routes, useNavigate } from "react-router-dom";
import Home from "./pages/Home";
import Contact from "./pages/Contact";
import Resources from "./pages/Resources";
import HowItWorks from "./pages/HowItWorks";
import Navbar from "./components/Navbar";
import Login from "./pages/Login";
import Error from "./pages/Error";
import SubmitReport from "./pages/SubmitReport";
import { useDispatch, useSelector } from "react-redux";
import TrackReport from "./pages/TrackReport";
import PoliceDashboard from "./pages/Police/PoliceDashboard";
import PolicePrivateRoute from "./components/Auth/PolicePrivateRoute";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminPrivateRoute from "./components/Auth/AdminPrivateRoute";
import { useEffect } from "react";



function App(){
  const user = JSON.parse(localStorage.getItem("user"));
  console.log("logged user in local storage", user)

return(
<div className="w-full -p-5 min-h-screen bg-richblack-900 flex flex-col font-inter">
<Navbar/>

<Routes>
  <Route path="/" element={<Home/>} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/resources" element={<Resources />} />
  <Route path="/contact" element={<Contact />} />
  <Route path="/how-it-works" element={<HowItWorks/>} />
  <Route path="/submit-report" element={<SubmitReport/>} />
  <Route path="/track-report" element={<TrackReport/>} />

  <Route path="/login" element={ <Login /> }/>


  <Route
          path="/police-dashboard"
          element={
            // <PolicePrivateRoute>
              <PoliceDashboard />
            // </PolicePrivateRoute>
          }
        />
  <Route
          path="/admin-dashboard"
          element={
            // <AdminPrivateRoute>
              <AdminDashboard />
            // </AdminPrivateRoute>
          }
        />


  <Route path="*" element={<Error />} />


  
</Routes>


</div>

)


}

export default App;
