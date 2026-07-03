import { lazy, Suspense } from "react";

const AppFlow = lazy(() => import("./variants/flow/AppFlow"));

export default function App() {
  return (
    <>
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:bg-accent focus:px-4 focus:py-2 focus:text-ink"
      >
        Перейти к содержимому
      </a>

      <Suspense
        fallback={
          <div className="flex min-h-screen items-center justify-center bg-ink text-paper-muted">
            Загрузка…
          </div>
        }
      >
        <AppFlow />
      </Suspense>
    </>
  );
}
