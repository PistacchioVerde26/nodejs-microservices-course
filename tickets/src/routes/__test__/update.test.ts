import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../App";
import { natsWrapper } from "../../nats-wrapper";

it("returns a 404 if the provided id does not exists", async () => {
  await request(app)
    .put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .set("Cookie", global.signin())
    .send({
      title: "adfasfas",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  await request(app)
    .put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .send({
      title: "adfasfas",
      price: 20,
    })
    .expect(401);
});

it("returns a 401 if the user is does not own the ticket", async () => {
  const ticket = { title: "title", price: 10 };
  const updatedTicket = { title: "updatedTitle", price: 20 };

  const createRes = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send(ticket)
    .expect(201);

  await request(app)
    .put(`/api/tickets/${createRes.body.id}`)
    .set("Cookie", global.signin())
    .send(updatedTicket)
    .expect(401);

  const ticketRes = await request(app)
    .get(`/api/tickets/${createRes.body.id}`)
    .send()
    .expect(200);

  expect(ticketRes.body.title).toEqual(ticket.title);
  expect(ticketRes.body.price).toEqual(ticket.price);
});

it("returns a 400 if the user does not provide a valid title or price", async () => {
  await request(app)
    .put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .set("Cookie", global.signin())
    .send({
      title: "safsafas",
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
    .set("Cookie", global.signin())
    .send({
      title: "safsafas",
      price: -10,
    })
    .expect(400);
});

it("it updates the ticket if valid inputs are provided", async () => {
  const cookie = global.signin();

  const ticket = { title: "title", price: 10 };
  const updatedTicket = { title: "updatedTitle", price: 20 };

  const createRes = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(ticket)
    .expect(201);

  const updateRes = await request(app)
    .put(`/api/tickets/${createRes.body.id}`)
    .set("Cookie", cookie)
    .send(updatedTicket)
    .expect(200);

  expect(updateRes.body.title).toEqual(updatedTicket.title);
  expect(updateRes.body.price).toEqual(updatedTicket.price);

  const ticketRes = await request(app)
    .get(`/api/tickets/${createRes.body.id}`)
    .send()
    .expect(200);

  expect(ticketRes.body.title).toEqual(updatedTicket.title);
  expect(ticketRes.body.price).toEqual(updatedTicket.price);
});

it("publishes an event", async () => {
  const cookie = global.signin();

  const ticket = { title: "title", price: 10 };
  const updatedTicket = { title: "updatedTitle", price: 20 };

  const createRes = await request(app)
    .post("/api/tickets")
    .set("Cookie", cookie)
    .send(ticket)
    .expect(201);

  const updateRes = await request(app)
    .put(`/api/tickets/${createRes.body.id}`)
    .set("Cookie", cookie)
    .send(updatedTicket)
    .expect(200);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
