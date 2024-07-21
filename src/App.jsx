import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { mainListItems } from "./components/mainListItems";
import Students from "./components/Students";
import Dashboard from "./components/Dashboard";
import Teachers from "./components/Teachers";
import Profile from "./components/Profile";
import Login from "./components/Login";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<PrivateRoute element={Dashboard} />} />
          <Route path="/students" element={<PrivateRoute element={Students} />} />
          <Route path="/teachers" element={<PrivateRoute element={Teachers} />} />
          <Route path="/profile" element={<PrivateRoute element={Profile} />} />
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
