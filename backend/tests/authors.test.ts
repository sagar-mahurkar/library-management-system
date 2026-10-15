import request from "supertest";
import { app } from "../src/app";
import { signAccessToken } from "../src/utils/jwt";
jest.mock("../src/modules/authors/authors.service", () => ({ authorsService: { list: jest.fn(), getById: jest.fn(), create: jest.fn(), update: jest.fn(), remove: jest.fn() } }));
import { authorsService } from "../src/modules/authors/authors.service";
const service = jest.mocked(authorsService);
const token = signAccessToken({ id: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4011", role: "LIBRARIAN" });
beforeEach(() => jest.clearAllMocks());
describe("authors API", () => {
  it("allows public author browsing", async () => { service.list.mockResolvedValue({ data: [{ id: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4012", name: "Robert Martin" }], meta: { page: 1, limit: 20, total: 1 } } as never); const res = await request(app).get("/api/v1/authors"); expect(res.status).toBe(200); expect(res.body.data[0].name).toBe("Robert Martin"); });
  it("creates an author for librarians", async () => { service.create.mockResolvedValue({ id: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4012", name: "Robert Martin" } as never); const res = await request(app).post("/api/v1/authors").set("Authorization", `Bearer ${token}`).send({ name: "Robert Martin" }); expect(res.status).toBe(201); expect(service.create).toHaveBeenCalledWith({ name: "Robert Martin" }); });
  it("rejects invalid author IDs", async () => { const res = await request(app).get("/api/v1/authors/not-a-uuid"); expect(res.status).toBe(400); });
});
