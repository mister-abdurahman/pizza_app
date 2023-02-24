const supertest = require("supertest");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
dotenv.config();

const app = require("../app");

const API_TEST_URL = process.env.API_TEST_URL;
const TEST_TOKEN = process.env.TEST_TOKEN;

describe("Testing different routes", () => {
  beforeAll(async () => {
    await mongoose.connect(API_TEST_URL);
    mongoose.connection.on("connected", async () => {
      console.log("Connected to MongoDB successfully");
    });

    mongoose.connection.on("error", (err) => {
      console.log("Error connecting to MongoDB", err);
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoose.connection.close();
  });

  test("Get all orders", async () => {
    const res = await supertest(app).get("/order");
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
  });

  test("Get Order By ID", async () => {
    const res = await supertest(app)
      .get("/order/639849eb096d17894e8df61a")
      .set("Authorization", `Bearer ${TEST_TOKEN}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
  });

  test("Create an Order", async () => {
    const data = {
      items: {
        name: "Chocolate Strawberry Pizza",
        price: 3000,
        size: "s",
        quantity: 5,
      },
      user_type: "user",
    };

    const res = await supertest(app)
      .post("/order")
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send(data);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
  });

  test("Update Order state", async () => {
    const data = {
      state: 1,
    };

    const res = await supertest(app)
      .put("/order/639849eb096d17894e8df61a")
      .set("Authorization", `Bearer ${TEST_TOKEN}`)
      .send(data);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
  });

  test("Delete an Order", async () => {
    const res = await supertest(app)
      .delete("/order/639849eb096d17894e8df61a")
      .set("Authorization", `Bearer ${TEST_TOKEN}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe(true);
  });
});
