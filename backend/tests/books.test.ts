import request from "supertest";
import { app } from "../src/app";
import { signAccessToken } from "../src/utils/jwt";

jest.mock("../src/modules/books/books.service", () => ({ booksService: { list: jest.fn(), getById: jest.fn(), create: jest.fn(), update: jest.fn(), remove: jest.fn() } }));
import { booksService } from "../src/modules/books/books.service";
const service = jest.mocked(booksService);
const librarianToken = () => signAccessToken({ id: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4001", role: "LIBRARIAN" });
const studentToken = () => signAccessToken({ id: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4002", role: "STUDENT" });
const book = {
  id: "book-1",
  title: "Test Book",
  isbn: null,
  publisher: null,
  publicationYear: null,
  authors: [],
  totalCopies: 2,
  availableCopies: 1,
  createdAt: "2026-10-15T00:00:00.000Z",
  updatedAt: "2026-10-15T00:00:00.000Z",
};
beforeEach(() => jest.clearAllMocks());
describe("books API", () => {
  it("allows public catalogue browsing", async () => { service.list.mockResolvedValue({ data: [book], meta: { page: 1, limit: 20, total: 1 } }); const res = await request(app).get("/api/v1/books"); expect(res.status).toBe(200); expect(res.body.data).toHaveLength(1); });
  it("requires librarian role to create a book", async () => { const res = await request(app).post("/api/v1/books").set("Authorization", `Bearer ${studentToken()}`).send({ title: "Clean Code", authorIds: ["2c90f4b0-2c83-4f19-bdf0-3f777d2a4004"] }); expect(res.status).toBe(403); expect(service.create).not.toHaveBeenCalled(); });
  it("validates create payloads", async () => { const res = await request(app).post("/api/v1/books").set("Authorization", `Bearer ${librarianToken()}`).send({ title: "", authorIds: [] }); expect(res.status).toBe(400); expect(res.body.error.code).toBe("VALIDATION_ERROR"); });
});
