import { BrowserRouter, Route, Routes } from "react-router-dom";
import SetupPage from "../pages/SetupPage";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SetupPage />} />
        <Route path="*" element={<SetupPage />} />
      </Routes>
    </BrowserRouter>
  );
}
