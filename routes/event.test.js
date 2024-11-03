const event = require('../routes/event');
const request = require("supertest");
const express = require("express");
const Event = require("../models/Event");
const sequelize = require("../config/database");

jest.mock("../models/Event");

const app = express();
app.use(express.json());
app.use("/events", event);

describe("POST /events/initialize", () => {
    afterAll(async () => {
      await sequelize.close();
    });

  it("should create an event and return 201 status", async () => {
    // Mock data for successful creation
    const mockEvent = { name: "Sample Event", totalTickets: 50, availableTickets: 50 };
    Event.create.mockResolvedValue(mockEvent); // Mock Event.create to return mockEvent

    const response = await request(app)
      .post("/events/initialize")
      .send({ name: "Sample Event", totalTickets: 50 });

    expect(response.status).toBe(201);
    expect(response.body).toEqual(mockEvent);
    expect(Event.create).toHaveBeenCalledWith({
      name: "Sample Event",
      totalTickets: 50,
      availableTickets: 50,
    });
  });

  it("should return 500 status if there is an error", async () => {
    Event.create.mockRejectedValue(new Error("Database error"));

    const response = await request(app)
      .post("/events/initialize")
      .send({ name: "Sample Event", totalTickets: 50 });

    expect(response.status).toBe(500);
    expect(response.body).toHaveProperty("message", "Database error");
  });
});


describe("POST /events/book", () => {
    it("should return 400 if required fields are missing", async () => {
        const response = await request(app)
            .post("/events/book")
            .send({}); // Missing fields

        expect(response.status).toBe(400);
        expect(response.body).toHaveProperty("message", "Event ID and User ID are required");
    });

    it("should return 500 if event is not found", async () => {
        const bookingData = { eventId: 1, userId: 1 };
        Event.findByPk.mockResolvedValue(null); // Event not found

        const response = await request(app)
            .post("/events/book")
            .send(bookingData);

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty("message", "Internal Server Error");
    });

    it("should return 500 status if there is an internal server error", async () => {
        Event.findByPk.mockRejectedValue(new Error("Database error")); // Simulate internal server error

        const response = await request(app)
            .post("/events/book")
            .send({ eventId: 1, userId: 1 });

        expect(response.status).toBe(500);
        expect(response.body).toHaveProperty("message", "Internal Server Error");
    });
});

