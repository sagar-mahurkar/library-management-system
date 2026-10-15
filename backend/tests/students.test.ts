import request from "supertest";
import { app } from "../src/app";
import { signAccessToken } from "../src/utils/jwt";
jest.mock("../src/modules/students/students.service", () => ({ studentsService: { list: jest.fn(), getById: jest.fn() } }));
import { studentsService } from "../src/modules/students/students.service";
const service = jest.mocked(studentsService);
const librarian = signAccessToken({ id: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4031", role: "LIBRARIAN" });
const student = signAccessToken({ id: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4032", role: "STUDENT" });
beforeEach(() => jest.clearAllMocks());
describe("students API", () => {
  it("blocks unauthenticated access", async () => { const res = await request(app).get("/api/v1/students"); expect(res.status).toBe(401); });
  it("blocks student access to the student directory", async () => { const res = await request(app).get("/api/v1/students").set("Authorization", `Bearer ${student}`); expect(res.status).toBe(403); });
  it("lists students for librarians", async () => { service.list.mockResolvedValue({ data: [{ id: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4033", name: "Student One", email: "student@example.com", role: "STUDENT" }], meta: { page: 1, limit: 20, total: 1 } } as never); const res = await request(app).get("/api/v1/students").set("Authorization", `Bearer ${librarian}`); expect(res.status).toBe(200); expect(res.body.data[0].role).toBe("STUDENT"); });
});

describe("students API validation regressions", () => {
  it("rejects an out-of-range page limit before calling the service", async () => {
    const response = await request(app).get("/api/v1/students?limit=101").set("Authorization", `Bearer ${librarian}`);
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(service.list).not.toHaveBeenCalled();
  });

  it("rejects malformed student IDs before calling the service", async () => {
    const response = await request(app).get("/api/v1/students/not-a-uuid").set("Authorization", `Bearer ${librarian}`);
    expect(response.status).toBe(400);
    expect(response.body.error.code).toBe("VALIDATION_ERROR");
    expect(service.getById).not.toHaveBeenCalled();
  });
});
