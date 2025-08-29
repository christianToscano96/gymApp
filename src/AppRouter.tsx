import TenantsPage from "./rental/pages/tenants/TenantsPage";
import DepartmentsPage from "./rental/pages/departments/DepartmentsPage";
import StaffPage from "./rental/pages/staff/StaffPage";
import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { useQuery } from "@tanstack/react-query";
import AuthLayout from "./auth/layaout/AuthLayout";
import LoginPage from "./auth/pages/LoginPage";
import RegisterPage from "./auth/pages/RegisterPage";

import { sleep } from "./lib/sleep";
import PrivateRoute from "./auth/components/PrivateRoute";
import { checkAuth } from "./fake/fake-data";

const ChatLayout = lazy(async () => {
  await sleep(1000);
  return import("./chat/layaout/ChatLayout");
});
const ChatPage = lazy(() => {
  return import("./chat/pages/ChatPage");
});

const RentalLayout = lazy(() => {
  return import("./rental/layaut/RentalLayout");
});

const DepartamentDetail = lazy(() => {
  return import("./rental/pages/departments/DepartamentDetail");
});

const NoChatSelected = lazy(() => {
  return import("./chat/pages/NoChatSelected");
});
function AppRouter() {
  const {
    data: user,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["user"],
    queryFn: () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No token ssfound");
      }
      return checkAuth(token);
    },
    retry: 0,
  });

  if (isLoading)
    return (
      <div className="flex flex-col items-center justify-center h-screen bg-background">
        <svg
          className="animate-spin h-12 w-12 text-primary mb-6"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
          ></path>
        </svg>
        <span className="text-lg font-semibold text-primary mb-2">
          Cargando...
        </span>
        <span className="text-sm text-muted-foreground">
          Por favor espera mientras preparamos todo para ti.
        </span>
      </div>
    );

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
        </Route>

        <Route
          path="/rental"
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
              <PrivateRoute isAuthenticated={!!user}>
                <RentalLayout user={user} />
              </PrivateRoute>
            </Suspense>
          }
        >
          <Route
            path="tenant"
            element={
              <Suspense fallback={<div>Cargando...</div>}>
                <TenantsPage />
              </Suspense>
            }
          />
          <Route
            path="departments"
            element={
              <Suspense fallback={<div>Cargando...</div>}>
                <DepartmentsPage />
              </Suspense>
            }
          />
          <Route
            path="staff"
            element={
              <Suspense fallback={<div>Cargando...</div>}>
                <StaffPage />
              </Suspense>
            }
          />
          <Route
            path="/rental/departments/:departmentId"
            element={<DepartamentDetail />}
          />
          <Route index element={<Navigate to="tenant" />} />
        </Route>

        <Route
          path="/chat"
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
              <PrivateRoute isAuthenticated={!!user}>
                <ChatLayout />
              </PrivateRoute>
            </Suspense>
          }
        >
          <Route index element={<NoChatSelected />} />
          <Route path="/chat/:clientId" element={<ChatPage />} />
        </Route>
        <Route path="/" element={<Navigate to="/auth" />} />
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
