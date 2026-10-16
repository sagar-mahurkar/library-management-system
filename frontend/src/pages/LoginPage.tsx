import LoginForm from "../components/forms/LoginForm";
export default function LoginPage() {
  return <div className="card border-0 shadow-sm"><div className="card-body p-4 p-md-5"><div className="book-cover mb-3"><i className="bi bi-person-lock" /></div><h1 className="h3 mb-1">Welcome back</h1><p className="text-secondary mb-4">Sign in to your library account.</p><LoginForm /><div className="alert alert-info small mt-4 mb-0">UI preview: credentials are not sent to a server yet.</div></div></div>;
}
