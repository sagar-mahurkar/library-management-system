import request from "supertest";
import { app } from "../src/app";
import { signAccessToken } from "../src/utils/jwt";
jest.mock("../src/modules/borrowings/borrowings.service", () => ({ borrowingsService: { issue: jest.fn(), return: jest.fn(), listForStudent: jest.fn() } }));
import { borrowingsService } from "../src/modules/borrowings/borrowings.service";
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
