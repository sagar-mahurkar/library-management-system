import request from "supertest";
import { app } from "../src/app";

describe("GET /health", () => {
  it("returns 200 when the application is running", async () => {
    const response = await request(app).get("/health");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      data: {
        status: "ok"
      }
    });
  });

  it("returns 404 for an unknown route", async () => {
    const response = await request(app).get("/unknown-route");

    expect(response.status).toBe(404);
    expect(response.body.error.code).toBe("NOT_FOUND");
  });
});
