import React from "react";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import AuthLayout from "./auth/layaout/AuthLayout";
import LoginPage from "./auth/pages/LoginPage";
import PrivateRoute from "./auth/components/PrivateRoute";
import RegisterForm from "./auth/pages/RegisterForm";

const GymLayout = lazy(() => {
  return import("./preview/layout/GymLayout");
});

const UserLayout = lazy(() => {
  return import("./user-preview/layout/UserLagout");
});

const TrainerLayout = lazy(() => {
  return import("./trainer-preview/layout/TrainerLayout");
});

const UserPage = lazy(() => {
  return import("./preview/pages/users/UserPage");
});

const DashboardLayout = lazy(() => {
  return import("./preview/pages/dashboard/DashboardPage");
});

const QrAccessControl = lazy(() => {
  return import("./preview/pages/qr-access-control/QrAccessControl");
});

const PaymentManagement = lazy(() => {
  return import("./preview/pages/payment-management/PaymentManagement");
});

const ProfilePreview = lazy(() => {
  return import("./preview/pages/profile-preview/ProfilePreview");
});

function AppRouter() {
  const checkAuth = React.useCallback(async (token: string) => {
    const response = await fetch("/api/auth/check", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error("Token inválido");
    }
    const data = await response.json();
    return data.user;
  }, []);

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: React.useCallback(() => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token encontrado");
      }
      return checkAuth(token);
    }, [checkAuth]),
    retry: 0,
  });

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <span className="text-lg font-semibold text-primary mb-2">
          Cargando...
        </span>
      </div>
    );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<LoginPage />} />
          <Route path="/auth/register" element={<RegisterForm />} />
        </Route>

        {/* RUTA ADMIN */}
        <Route
          path="/preview"
          element={
            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center h-screen bg-background">
                  <span className="text-lg font-semibold text-primary">
                    Cargando, por favor espera...
                  </span>
                  <div className="w-48 mt-6">
                    <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-2 bg-primary animate-loading-slider rounded-full"
                        style={{ width: "40%" }}
                      ></div>
                    </div>
                  </div>
                  <style>
                    {`
                      @keyframes loading-slider {
                        0% { width: 0%; }
                        50% { width: 80%; }
                        100% { width: 0%; }
                      }
                      .animate-loading-slider {
                        animation: loading-slider 1.5s infinite;
                      }
                    `}
                  </style>
                </div>
              }
            >
              <PrivateRoute requiredRole="administrator">
                <GymLayout />
              </PrivateRoute>
            </Suspense>
          }
        >
          <Route
            path="users"
            element={
              <Suspense fallback={<div>Cargando...</div>}>
                <UserPage />
              </Suspense>
            }
          />
          <Route
            path="dashboard"
            element={
              <Suspense fallback={<div>Cargando...</div>}>
                <DashboardLayout />
              </Suspense>
            }
          />
          <Route
            path="qr-access-control"
            element={
              <Suspense fallback={<div>Cargando...</div>}>
                <QrAccessControl />
              </Suspense>
            }
          />
          <Route
            path="payments"
            element={
              <Suspense fallback={<div>Cargando...</div>}>
                <PaymentManagement />
              </Suspense>
            }
          />
          <Route
            path="/preview/:id"
            element={
              <Suspense fallback={<div>Cargando...</div>}>
                <ProfilePreview id={user?.id} />
              </Suspense>
            }
          />
          <Route index element={<Navigate to="dashboard" />} />
        </Route>

        {/* RUTA USUARIO NORMAL */}
        <Route
          path="/user-preview"
          element={
            <Suspense fallback={<div>Cargando...</div>}>
              <PrivateRoute requiredRole="user">
                <UserLayout />
              </PrivateRoute>
            </Suspense>
          }
        />

        {/* RUTA TRAINER  */}
        <Route
          path="/trainer-preview"
          element={
            <Suspense fallback={<div>Cargando...</div>}>
              <PrivateRoute requiredRole="trainer">
                <TrainerLayout />
              </PrivateRoute>
            </Suspense>
          }
        />

        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
