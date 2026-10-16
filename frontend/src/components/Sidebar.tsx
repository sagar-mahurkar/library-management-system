import { NavLink } from "react-router-dom";
import type { UserRole } from "../types/auth.types";
const studentLinks = [{ to: "/student", label: "Dashboard", icon: "speedometer2" }, { to: "/books", label: "Browse books", icon: "search" }, { to: "/student/borrowings", label: "My borrowings", icon: "journal-bookmark" }];
const librarianLinks = [{ to: "/librarian", label: "Dashboard", icon: "speedometer2" }, { to: "/librarian/books", label: "Manage books", icon: "book" }, { to: "/librarian/authors", label: "Authors", icon: "people" }, { to: "/librarian/copies", label: "Physical copies", icon: "bookshelf" }, { to: "/librarian/students", label: "Students", icon: "person-vcard" }, { to: "/librarian/borrowings", label: "Borrowings", icon: "arrow-left-right" }];
export default function Sidebar({ role }: { role: UserRole }) {
  const links = role === "STUDENT" ? studentLinks : librarianLinks;
  return <nav className="sidebar-nav d-flex flex-column gap-1"><div className="small text-uppercase text-secondary fw-semibold px-2 mb-2">{role === "STUDENT" ? "Student menu" : "Librarian menu"}</div>{links.map(link => <NavLink key={link.to} to={link.to} end className={({ isActive }) => `sidebar-link${isActive ? " active" : ""}`}><i className={`bi bi-${link.icon}`} />{link.label}</NavLink>)}</nav>;
}
