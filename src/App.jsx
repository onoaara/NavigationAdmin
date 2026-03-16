import { useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Login from "./pages/Login";
import Cabs from "./pages/Cabs";
import Events from "./pages/Events";
import PopularPlaces from "./pages/PopularPlaces";
import PhotoGalleryAdmin from "./pages/PhotoGalleryAdmin";
import Navbar from "./components/NavBar";
import Maps from "./pages/Maps";

const App = () => {
  const [authenticated, setAuthenticated] = useState(false);

  const ProtectedRoute = ({ children }) => {
    if (!authenticated) {
      return <Navigate to="/login" />;
    }
    return children;
  };

  return (
    <Router>
      <div style={{ display: "flex" }}>
        {authenticated && <Sidebar />}
        <div style={{ flex: 1 }}>
          {authenticated && <Navbar />}
          <div style={{ padding: "20px" }}>
            <Routes>
              <Route
                path="/login"
                element={<Login setAuthenticated={setAuthenticated} />}
              />
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Dashboard />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/users"
                element={
                  <ProtectedRoute>
                    <Users />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/cabs"
                element={
                  <ProtectedRoute>
                    <Cabs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/events"
                element={
                  <ProtectedRoute>
                    <Events />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/popular-places"
                element={
                  <ProtectedRoute>
                    <PopularPlaces />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/photo-gallery"
                element={
                  <ProtectedRoute>
                    <PhotoGalleryAdmin />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/maps"
                element={
                  <ProtectedRoute>
                    <Maps />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
};

export default App;
