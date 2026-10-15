import request from "supertest";
import { app } from "../src/app";
import { signAccessToken } from "../src/utils/jwt";
jest.mock("../src/modules/borrowings/borrowings.service", () => ({ BorrowingsServiceError: class BorrowingsServiceError extends Error { constructor(public readonly statusCode: number, public readonly code: string, message: string) { super(message); } }, borrowingsService: { issue: jest.fn(), return: jest.fn(), listForStudent: jest.fn() } }));
import { BorrowingsServiceError, borrowingsService } from "../src/modules/borrowings/borrowings.service";
const service = jest.mocked(borrowingsService);
const librarian = signAccessToken({ id: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4041", role: "LIBRARIAN" });
const student = signAccessToken({ id: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4042", role: "STUDENT" });
const borrowingId = "2c90f4b0-2c83-4f19-bdf0-3f777d2a4043";
beforeEach(() => jest.clearAllMocks());
describe("borrowings API", () => {
  it("allows a student to view only their own history route", async () => { service.listForStudent.mockResolvedValue({ data: [], meta: { page: 1, limit: 20, total: 0 } }); const res = await request(app).get("/api/v1/borrowings/me").set("Authorization", `Bearer ${student}`); expect(res.status).toBe(200); expect(service.listForStudent).toHaveBeenCalledWith("2c90f4b0-2c83-4f19-bdf0-3f777d2a4042", expect.any(Object)); });
  it("allows librarians to issue copies with valid payloads", async () => { service.issue.mockResolvedValue({ id: borrowingId, overdue: false } as never); const res = await request(app).post("/api/v1/borrowings").set("Authorization", `Bearer ${librarian}`).send({ studentId: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4042", bookCopyId: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4044", dueAt: "2030-01-01T00:00:00Z" }); expect(res.status).toBe(201); });
  it("denies students access to librarian issue operations", async () => { const res = await request(app).post("/api/v1/borrowings").set("Authorization", `Bearer ${student}`).send({}); expect(res.status).toBe(403); expect(service.issue).not.toHaveBeenCalled(); });
});

describe("borrowings API validation and error regressions", () => {
  it("rejects an invalid issue payload before calling the service", async () => {
    const response = await request(app).post("/api/v1/borrowings").set("Authorization", `Bearer ${librarian}`).send({ studentId: "not-a-uuid", bookCopyId: "not-a-uuid", dueAt: "yesterday" });
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(service.issue).not.toHaveBeenCalled();
  });

  it("translates a copy-unavailable service error to a conflict response", async () => {
    service.issue.mockRejectedValue(new BorrowingsServiceError(409, "COPY_UNAVAILABLE", "Physical copy is already issued"));
    const response = await request(app).post("/api/v1/borrowings").set("Authorization", `Bearer ${librarian}`).send({ studentId: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4042", bookCopyId: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4044", dueAt: "2030-01-01T00:00:00Z" });
    expect(response.status).toBe(409);
    expect(response.body.error.code).toBe("COPY_UNAVAILABLE");
  });
});
