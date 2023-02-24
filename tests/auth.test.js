const supertest = require("supertest");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
// const { MongoMemoryServer } = require("mongodb-memory-server");
dotenv.config();

const app = require("../app");

const API_TEST_URL = process.env.API_TEST_URL;

describe("Signup & LogIn route", () => {
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

  describe("Get Home route", () => {
    describe("Given route exists", () => {
      it("should return a 200", async () => {
        const res = await supertest(app).get("/");
        expect(res.statusCode).toBe(200);
        expect(res.body.status).toBe(true);
      });
    });
  });

  describe("signing up", () => {
    describe("Signup route", () => {
      describe("Given that a user signs up successfully", () => {
        it("should pass for all checks", async () => {
          const userData = {
            firstname: "abdurahman090",
            lastname: "aramide090",
            username: "abduRahman010",
            email: "abdu2gmail.com",
            password: "ramadan12345",
          };
          const res = await supertest(app)
            .post("/auth/signup")
            .set("content-type", "application/x-www-form-urlencoded")
            .send(userData);
          expect(res.statusCode).toBe(200);
          expect(res.body.message).toBe("User created successfully");
        });
      });
    });
  });

  describe("logging in", () => {
    it("Log In", async () => {
      const userData = {
        username: "abduRahman010",
        password: "ramadan12345",
      };
      const res = await supertest(app)
        .post("/auth/login")
        .set("content-type", "application/x-www-form-urlencoded")
        .send(userData);
      expect(res.statusCode).toBe(200);
      expect(res.body.message).toBe("Logged in successfully");
    });
  });
});
