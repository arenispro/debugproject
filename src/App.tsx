import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import "./App.css";
import Registration from "./Registration";
//import 'bootstrap/dist/css/bootstrap.min.css';

const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/register" element={<Registration />} />
        <Route path="*" element={<div>404</div>} />
      </Routes>
    </Router>
  );
};

export default App;
