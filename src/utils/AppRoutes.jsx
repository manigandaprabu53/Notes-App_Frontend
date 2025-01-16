import { Navigate } from "react-router-dom";
import Home from "../pages/Home/Home.jsx";
import Login from "../pages/Login/Login.jsx";
import Signup from "../pages/SignUp/Signup.jsx";

const AppRoutes = [
    {
        path: "/",
        element: <Home/>
    },
    {
        path: "/login",
        element: <Login/>
    },
    {
        path: "/signup",
        element: <Signup/>
    },

    {
        path: "*",
        element: <Navigate to="/login"/>
    }
]

export default AppRoutes;