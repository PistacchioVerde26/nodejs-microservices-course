import {
  currentUser,
  NotFoundError,
  requireAuth,
  UnauthorizedError,
  validateRequest,
} from "@ab_tickets/common";
import express, { Response, Request } from "express";
import { body } from "express-validator";
import { TicketUpdatedPublisher } from "../events/publishers/ticket-updated-publisher";
import { Ticket } from "../model/ticket";
import { natsWrapper } from "../nats-wrapper";

const router = express.Router();

router.put(
  "/api/tickets/:id",
  currentUser,
  requireAuth,
  [
    body("title").trim().not().isEmpty().withMessage("Title is required"),
    body("price")
      .isFloat({ gt: 0 })
      .withMessage("Price must be greater than 0.00"),
  ],
  validateRequest,
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { title, price } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      throw new NotFoundError();
    }

    // Should throw a 403 actually
    if (ticket.userId !== req.currentUser!.id) {
      throw new UnauthorizedError("Forbidden");
    }

    ticket.title = title;
    ticket.price = price;

    await ticket.save();

    await new TicketUpdatedPublisher(natsWrapper.client).publish({
      id: ticket.id,
      ...ticket,
    });

    res.status(200).send(ticket);
  }
);

export { router as updateTicketRouter };
