import React, { useContext } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { Toaster } from "react-hot-toast";
import { AuthContext } from "../context/AuthContext.jsx";
const App = () => {
  const { authUser } = useContext(AuthContext);

  return (
    <div className="bg-[url('./src/assets/bgImage.jpg')] bg-cover bg-no-repeat">
      <Toaster />
      <Routes>
        <Route
          path='/'
          element={authUser ? <HomePage /> : <Navigate to='/Login' />}
        />
        <Route
          path='/Login'
          element={!authUser ? <LoginPage /> : <Navigate to='/' />}
        />
        <Route
          path='/Profile'
          element={authUser ? <ProfilePage /> : <Navigate to='/Login' />}
        />
      </Routes>
    </div>
  );
};

export default App;
