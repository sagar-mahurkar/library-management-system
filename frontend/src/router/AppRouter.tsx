import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import AppLayout from "../layouts/AppLayout";
import AuthLayout from "../layouts/AuthLayout";
import StudentLayout from "../layouts/StudentLayout";
import LibrarianLayout from "../layouts/LibrarianLayout";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import BooksPage from "../pages/BooksPage";
import BookDetailsPage from "../pages/BookDetailsPage";
import StudentDashboardPage from "../pages/StudentDashboardPage";
import MyBorrowingsPage from "../pages/MyBorrowingsPage";
import LibrarianDashboardPage from "../pages/LibrarianDashboardPage";
import ManageBooksPage from "../pages/ManageBooksPage";
import ManageAuthorsPage from "../pages/ManageAuthorsPage";
import ManageCopiesPage from "../pages/ManageCopiesPage";
import ManageStudentsPage from "../pages/ManageStudentsPage";
import ManageBorrowingsPage from "../pages/ManageBorrowingsPage";
import NotFoundPage from "../pages/NotFoundPage";

export default function AppRouter() {
  return <BrowserRouter><Routes>
    <Route element={<AuthLayout />}><Route path="/login" element={<LoginPage />} /><Route path="/register" element={<RegisterPage />} /></Route>
    <Route element={<AppLayout />}><Route path="/" element={<Navigate to="/books" replace />} /><Route path="/books" element={<BooksPage />} /><Route path="/books/:id" element={<BookDetailsPage />} /></Route>
    <Route element={<StudentLayout />}><Route path="/student" element={<StudentDashboardPage />} /><Route path="/student/borrowings" element={<MyBorrowingsPage />} /></Route>
    <Route element={<LibrarianLayout />}><Route path="/librarian" element={<LibrarianDashboardPage />} /><Route path="/librarian/books" element={<ManageBooksPage />} /><Route path="/librarian/authors" element={<ManageAuthorsPage />} /><Route path="/librarian/copies" element={<ManageCopiesPage />} /><Route path="/librarian/students" element={<ManageStudentsPage />} /><Route path="/librarian/borrowings" element={<ManageBorrowingsPage />} /></Route>
    <Route path="*" element={<NotFoundPage />} />
  </Routes></BrowserRouter>;
}
