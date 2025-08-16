import { Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider, CssBaseline, createTheme } from "@mui/material";
import LoginPage from "./LoginPage";
import DashboardPage from "./DashboardPage";
import ProtectedRoute from "./ProtectedRoute";
import "./App.css";

function App() {
  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/dashboard"
          element={
            // <ProtectedRoute>
              <DashboardPage />
            // </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </ThemeProvider>
  );
}

export default App;
