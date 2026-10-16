import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import PageHeader from "../components/PageHeader";
import BorrowingTable from "../components/BorrowingTable";
import LoadingState from "../components/LoadingState";
import ErrorState from "../components/ErrorState";
import EmptyState from "../components/EmptyState";
import { listMyBorrowings } from "../services/borrowingsService";

export default function StudentDashboardPage() {
  const query = useQuery({
    queryKey: ["my-borrowings", "active"],
    queryFn: () =>
      listMyBorrowings({ page: 1, limit: 50, status: "active" }),
  });

  const active = query.data?.items ?? [];

  const metrics = [
    {
      label: "Current borrowings",
      value: active.filter((borrowing) => borrowing.status !== "RETURNED").length,
      icon: "journal-bookmark",
    },
    {
      label: "Overdue items",
      value: active.filter((borrowing) => borrowing.status === "OVERDUE").length,
      icon: "clock-history",
    },
  ];

  return (
    <>
      <PageHeader
        title="Student dashboard"
        description="Your library activity at a glance."
      />

      {query.isLoading ? (
        <LoadingState />
      ) : query.isError ? (
        <ErrorState message="Unable to load your borrowing information." />
      ) : (
        <>
          <div className="row g-3 mb-4">
            {metrics.map((metric) => (
              <div className="col-12 col-md-6" key={metric.label}>
                <div className="card metric-card">
                  <div className="card-body d-flex align-items-center gap-3">
                    <span className="book-cover">
                      <i className={`bi bi-${metric.icon}`} />
                    </span>
                    <div>
                      <div className="text-secondary small">{metric.label}</div>
                      <div className="h3 mb-0">{metric.value}</div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <h2 className="h5 mb-3">Your current loans</h2>
          <div className="card border-0 shadow-sm">
            {active.length > 0 ? (
              <BorrowingTable borrowings={active} />
            ) : (
              <EmptyState title="No current loans" />
            )}
          </div>
        </>
      )}

      <Link
        to="/student/borrowings"
        className="btn btn-outline-primary mt-4 me-2"
      >
        View history
      </Link>
      <Link to="/books" className="btn btn-primary mt-4">
        Browse catalogue
      </Link>
    </>
  );
}
