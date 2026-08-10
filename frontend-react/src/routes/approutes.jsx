import {
  BrowserRouter,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";

import DashboardLayout from "../components/layout/DashboardLayout";

import Dashboard from "../pages/dashboard";
import Books from "../pages/books";
import Members from "../pages/members";
import Loans from "../pages/loans";
import Reports from "../pages/reports";
import Audit from "../pages/audit";
import Login from "../pages/Login";
import Signup from "../pages/Signup";

import ProtectedRoute from "./ProtectedRoute";

export default function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        {/* ============================
            PUBLIC
        ============================ */}

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/signup"
          element={<Signup />}
        />

        {/* ============================
            PROTECTED
        ============================ */}

        <Route element={<ProtectedRoute />}>

          <Route
            element={
              <DashboardLayout>
                <Outlet />
              </DashboardLayout>
            }
          >

            <Route
              path="/"
              element={<Dashboard />}
            />

            <Route
              path="/books"
              element={<Books />}
            />

            <Route
              path="/members"
              element={<Members />}
            />

            <Route
              path="/loans"
              element={<Loans />}
            />

            <Route
              path="/reports"
              element={<Reports />}
            />

            <Route
              path="/audit"
              element={<Audit />}
            />

          </Route>

        </Route>

      </Routes>

    </BrowserRouter>
  );
}