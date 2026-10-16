import { Outlet } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
import Sidebar from "../components/Sidebar";

export default function StudentLayout() {
  return (
    <div className="app-shell">
      <AppNavbar />

      <div className="container-fluid">
        <div className="row">
          <aside className="col-12 col-md-auto p-3 app-sidebar bg-white border-end">
            <Sidebar role="STUDENT" />
          </aside>

          <main className="col app-main p-4 p-lg-5">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
}
