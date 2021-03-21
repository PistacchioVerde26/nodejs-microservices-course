import mongoose from 'mongoose';
import request from 'supertest'
import { app } from '../../App'

it('returns a 404 if the ticket is not found', async () => {
    await request(app)
        .get(`/api/tickets/${new mongoose.Types.ObjectId().toHexString()}`)
        .send()
        .expect(404);
})

it('returns the ticket if the ticket is found', async () => {
    const ticket = {
        title: 'dfdfdf',
        price: 20
    }

    const createRes = await request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send(ticket)
        .expect(201);

    const res = await request(app)
        .get(`/api/tickets/${createRes.body.id}`)
        .send()
        .expect(200);

    expect(res.body.title).toEqual(ticket.title);
    expect(res.body.price).toEqual(ticket.price);
})