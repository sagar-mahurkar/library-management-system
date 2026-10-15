import request from "supertest";
import { app } from "../src/app";
import { signAccessToken } from "../src/utils/jwt";

jest.mock("../src/modules/summary/summary.service", () => ({
  summaryService: { getSummary: jest.fn() },
}));

import { summaryService } from "../src/modules/summary/summary.service";

const service = jest.mocked(summaryService);
const librarianToken = () =>
  signAccessToken({ id: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4001", role: "LIBRARIAN" });
const studentToken = () =>
  signAccessToken({ id: "2c90f4b0-2c83-4f19-bdf0-3f777d2a4002", role: "STUDENT" });

const summary = {
  totalBooks: 12,
  totalCopies: 30,
  availableCopies: 18,
  activeBorrowings: 12,
  overdueBorrowings: 3,
};

beforeEach(() => jest.clearAllMocks());

describe("summary API", () => {
  it("returns the summary for a librarian", async () => {
    service.getSummary.mockResolvedValue(summary);

    const response = await request(app)
      .get("/api/v1/summary")
      .set("Authorization", `Bearer ${librarianToken()}`);

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ data: summary });
    expect(service.getSummary).toHaveBeenCalledTimes(1);
  });

  it("requires authentication", async () => {
    const response = await request(app).get("/api/v1/summary");

    expect(response.status).toBe(401);
    expect(service.getSummary).not.toHaveBeenCalled();
  });

  it("denies summary access to students", async () => {
    const response = await request(app)
      .get("/api/v1/summary")
      .set("Authorization", `Bearer ${studentToken()}`);

    expect(response.status).toBe(403);
    expect(service.getSummary).not.toHaveBeenCalled();
  });
});

describe("summary API failure handling", () => {
  it("returns the standard internal error envelope when the service fails unexpectedly", async () => {
    service.getSummary.mockRejectedValue(new Error("database connection details should not be returned"));
    const response = await request(app).get("/api/v1/summary").set("Authorization", `Bearer ${librarianToken()}`);
    expect(response.status).toBe(500);
    expect(response.body.error.code).toBe("INTERNAL_SERVER_ERROR");
    expect(typeof response.body.error.message).toBe("string");
  });
});
