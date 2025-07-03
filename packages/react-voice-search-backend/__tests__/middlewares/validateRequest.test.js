import express from "express";
import request from "supertest";
import Joi from "joi";
import {
  validateParams,
  validateRequest,
  validateQuery,
} from "../../middlewares/validateRequest.js";

let app;

beforeEach(() => {
  app = express();
  app.use(express.json());
});

describe("Integration: Validation Middleware", () => {
  describe("validateParams", () => {
    beforeEach(() => {
      const paramSchema = Joi.object({
        id: Joi.number().required(),
      });

      app.get("/params/:id", validateParams(paramSchema), (req, res) => {
        res.status(200).json({ params: req.params });
      });
    });

    it("should return 200 for valid params", async () => {
      const res = await request(app).get("/params/123");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ params: { id: 123 } });
    });

    it("should return 400 for invalid params", async () => {
      const res = await request(app).get("/params/abc");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toContain('"id" must be a number');
    });
  });

  describe("validateRequest", () => {
    beforeEach(() => {
      const bodySchema = Joi.object({
        name: Joi.string().min(3).required(),
      });

      app.post("/body", validateRequest(bodySchema), (req, res) => {
        res.status(200).json({ body: req.body });
      });
    });

    it("should return 200 for valid body", async () => {
      const res = await request(app).post("/body").send({ name: "sampleusername" });
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ body: { name: "sampleusername" } });
    });

    it("should return 400 for invalid body", async () => {
      const res = await request(app).post("/body").send({ name: "K" });
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toContain('"name" length must be at least 3 characters long');
    });
  });

  describe("validateQuery", () => {
    beforeEach(() => {
      const querySchema = Joi.object({
        page: Joi.number().integer().min(1).required(),
      });

      app.get("/query", validateQuery(querySchema), (req, res) => {
        res.status(200).json({ query: req.query });
      });
    });

    it("should return 200 for valid query", async () => {
      const res = await request(app).get("/query?page=2");
      expect(res.status).toBe(200);
      expect(res.body).toEqual({ query: { page: "2" } });
    });

    it("should return 400 for missing or invalid query", async () => {
      const res = await request(app).get("/query?page=zero");
      expect(res.status).toBe(400);
      expect(res.body).toHaveProperty("error");
      expect(res.body.error).toContain('"page" must be a number');
    });
  });
});
