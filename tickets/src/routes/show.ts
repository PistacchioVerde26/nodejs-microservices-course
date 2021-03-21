import { NotFoundError } from '@ab_tickets/common';
import express, { Request, Response } from 'express';
import { Ticket } from '../model/ticket';

const router = express.Router();

router.get(
    '/api/tickets/:id',
    async (req: Request, res: Response) => {
        const { id } = req.params;
        const ticket = await Ticket.findById(id);

        if (!ticket) {
            throw new NotFoundError();
        }

        res.send(ticket);
    })

export { router as showTicketRouter };
