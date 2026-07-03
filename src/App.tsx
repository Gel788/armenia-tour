import { lazy, Suspense } from "react";
import { TourContentProvider } from "./context/TourContentContext";

const AppFlow = lazy(() => import("./variants/flow/AppFlow"));
const AdminApp = lazy(() => import("./admin/AdminApp"));

function Loading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-ink text-paper-muted">
      Загрузка…
    </div>
  );
}

export default function App() {
  const isAdmin = window.location.pathname.startsWith("/admin");

  return (
    <TourContentProvider>
      {!isAdmin && (
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:text-ink"
        >
          Перейти к содержимому
        </a>
      )}

      <Suspense fallback={<Loading />}>
        {isAdmin ? <AdminApp /> : <AppFlow />}
      </Suspense>
    </TourContentProvider>
  );
}
