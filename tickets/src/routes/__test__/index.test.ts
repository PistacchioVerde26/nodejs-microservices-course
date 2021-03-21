import request from 'supertest'
import { app } from '../../App'

const createTicket = (ticket: any) => {
    return request(app)
        .post('/api/tickets')
        .set('Cookie', global.signin())
        .send(ticket)
        .expect(201);
}

it('can fetch a list of tickest', async () => {
    const ticket1 = {
        title: 'ticket1',
        price: 10
    }

    const ticket2 = {
        title: 'ticket2',
        price: 20
    }

    const ticket3 = {
        title: 'ticket3',
        price: 30
    }

    await createTicket(ticket1);
    await createTicket(ticket2);
    await createTicket(ticket3);

    const res = await request(app)
        .get('/api/tickets')
        .send()
        .expect(200);

    expect(res.body.length).toEqual(3);
})