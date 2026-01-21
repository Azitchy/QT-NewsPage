import { Routes, Route, Navigate } from "react-router-dom";
import LoginLayout from "@/layouts/LoginLayout";
import AppLayout from "@/layouts/AppLayout";

import Connect from "@/screens/Connect";
import Dashboard from "@/screens/Dashboard";
import Connections from "@/screens/Connections";

function App() {
  return (
    <Routes>
      <Route element={<LoginLayout />}>
        <Route path="/connect" element={<Connect />} />
      </Route>

      <Route element={<AppLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/connections" element={<Connections />} />
      </Route>
    </Routes>
  );
}

export default App;
