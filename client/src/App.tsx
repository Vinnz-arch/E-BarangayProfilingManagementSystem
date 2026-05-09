import { Suspense } from "react";
import { RouterProvider } from "react-router-dom";
import { Routes } from "./routes/Routes";

const App = () => {
  return (
    <Suspense fallback={<div className="flex h-screen w-screen items-center justify-center bg-bg-dark text-text">Loading...</div>}>
      <RouterProvider router={Routes} />
    </Suspense>
  );
};

export default App;