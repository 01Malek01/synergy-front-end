import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes.tsx";
import Layout from "./Layout/Layout.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AuthContextProvider from "./Context/AuthContext.tsx";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import PostsProvider from "./Context/PostsContext.tsx";
import { NotificationContextProvider } from "./Context/NotificationContext.tsx";
import SocketProvider from "./Context/SocketContext.tsx";

const client = new QueryClient();
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={client}>
      <AuthContextProvider>
        <SocketProvider>
          <NotificationContextProvider>
            <PostsProvider>
              <BrowserRouter>
                <Layout>
                  <ToastContainer position="top-center" />
                  <AppRoutes />
                </Layout>
              </BrowserRouter>
            </PostsProvider>
          </NotificationContextProvider>
        </SocketProvider>
      </AuthContextProvider>
    </QueryClientProvider>
  </StrictMode>
);
