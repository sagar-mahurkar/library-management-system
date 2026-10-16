import type { Borrowing } from "../types/borrowing.types";
import StatusBadge from "./StatusBadge";
interface Props { borrowings: Borrowing[]; showStudent?: boolean; onReturn?: (borrowing: Borrowing) => void }
export default function BorrowingTable({ borrowings, showStudent = false, onReturn }: Props) {
  return <div className="table-responsive"><table className="table align-middle mb-0"><thead><tr>{showStudent && <th>Student</th>}<th>Book</th><th>Copy</th><th>Issued</th><th>Due date</th><th>Status</th>{onReturn && <th className="text-end">Action</th>}</tr></thead><tbody>
    {borrowings.map(item => <tr key={item.id}>{showStudent && <td>{item.studentName}</td>}<td>{item.bookTitle}</td><td>{item.copyCode}</td><td>{item.issuedAt}</td><td>{item.dueAt}</td><td><StatusBadge status={item.status} /></td>{onReturn && <td className="text-end">{item.status !== "RETURNED" && <button className="btn btn-sm btn-outline-primary" onClick={() => onReturn(item)}>Record return</button>}</td>}</tr>)}
  </tbody></table></div>;
}
