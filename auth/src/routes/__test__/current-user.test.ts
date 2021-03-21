import request from 'supertest'
import { app } from '../../App'

it('responds with details about the current user', async () => {
    const cookie = await global.signin()

    const response = await request(app)
        .get('/api/users/currentuser')
        .set('Cookie', cookie)
        .send()
        .expect(200);

    expect(response.body.currentUser).toBeDefined();
    expect(response.body.currentUser.email).toEqual("test@test.com");

})

it('return responds with null if not authenticated', async () => {
    const response = await request(app)
        .get('/api/users/currentuser')
        .send()
        .expect(200);

    expect(response.body.currentUser).toBeUndefined();

})