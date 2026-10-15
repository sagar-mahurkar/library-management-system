import request from "supertest";
import { app } from "../src/app";
import { signAccessToken } from "../src/utils/jwt";
jest.mock("../src/modules/book-copies/book-copies.service", () => ({ bookCopiesService: { list: jest.fn(), create: jest.fn(), remove: jest.fn() } }));
import { bookCopiesService } from "../src/modules/book-copies/book-copies.service";
const service = jest.mocked(bookCopiesService);
const token = signAccessToken({ id: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4021", role: "LIBRARIAN" });
const bookId = "2c90f4b0-2c83-4f19-bdf0-3f777d2a4022";
beforeEach(() => jest.clearAllMocks());
describe("book copies API", () => {
  it("returns copy availability", async () => { service.list.mockResolvedValue({ data: [{ id: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4023", copyCode: "CC-001", available: true }] }); const res = await request(app).get(`/api/v1/books/${bookId}/copies`); expect(res.status).toBe(200); expect(res.body.data[0].available).toBe(true); });
  it("allows librarians to add a copy", async () => { service.create.mockResolvedValue({ id: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4023", bookId, copyCode: "CC-001" } as never); const res = await request(app).post(`/api/v1/books/${bookId}/copies`).set("Authorization", `Bearer ${token}`).send({ copyCode: "CC-001" }); expect(res.status).toBe(201); });
  it("rejects blank copy codes", async () => { const res = await request(app).post(`/api/v1/books/${bookId}/copies`).set("Authorization", `Bearer ${token}`).send({ copyCode: " " }); expect(res.status).toBe(400); });
});
