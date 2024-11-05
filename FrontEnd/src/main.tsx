import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { BrowserRouter as Router } from "react-router-dom";
import AuthProvider from "./store/authContext.tsx";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/http.ts";

import "./firebase/firebase.tsx";
import { ErrorBoundary } from "react-error-boundary";
import { ErrorPage } from "./views/ErrorPage.tsx";

// Register service worker

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((error) => {
      console.error("Service Worker registration failed:", error);
    });
}

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ErrorBoundary
    FallbackComponent={ErrorPage}
    onError={() => console.log("An error occurred in the app")}
  >
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <App />
        </AuthProvider>
      </Router>
    </QueryClientProvider>
  </ErrorBoundary>
);
