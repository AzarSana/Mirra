import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";

import Landing from "./pages/Landing";
import MicPermission from "./pages/MicPermissions";
import Listen from "./pages/Listen";
import Transcript from "./pages/Transcript";

export default function App() {
  const getInitialTheme = () =>
    window.matchMedia?.("(prefers-color-scheme: dark)")?.matches
      ? "dark"
      : "light";

  const [theme, setTheme] = useState(getInitialTheme);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", theme === "dark");
  }, [theme]);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={<Landing theme={theme} setTheme={setTheme} />}
        />
        <Route
          path="/mic"
          element={<MicPermission theme={theme} setTheme={setTheme} />}
        />
        <Route path="/listen" element={<Listen theme={theme} setTheme={setTheme} />} />
        <Route path="/hi" element={<Transcript />} />
      </Routes>
    </BrowserRouter>
  );
}
