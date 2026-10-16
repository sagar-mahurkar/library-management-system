import { Outlet } from "react-router-dom";
import AppNavbar from "../components/AppNavbar";
export default function AppLayout() {
  return <div className="app-shell"><AppNavbar /><div className="container-fluid"><div className="row"><main className="col-12 app-main p-4 p-lg-5"><Outlet /></main></div></div></div>;
}
