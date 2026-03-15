import { useEffect, useRef, useState, useCallback } from "react";
import { useSession } from "./lib/authClient";
import { Route, Routes, useNavigate } from "react-router";
import Home from "./screens/Home";
import Login from "./screens/Login";

function App() {
  const auth = useSession();
  const navigate = useNavigate();

  useEffect(() => {
    if (
      !auth.isPending &&
      !auth.isRefetching &&
      !auth.error &&
      auth.data === null
    ) {
      //Navigate to login
      navigate("/login");
    }
  }, [auth]);

  return (
    <div className="h-screen w-screen bg-gray-900 text-white">
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </div>
  );
}

export default App;
