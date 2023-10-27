import app, { init } from "@/app";
import { cleanDb, generateValidToken } from "../helpers";
import supertest from "supertest";
import { faker } from "@faker-js/faker";
import httpStatus from "http-status";
import { createEvent, createUser } from "../factories";
import * as jwt from 'jsonwebtoken';

beforeAll(async ()=>{
    await init();
})

beforeEach(async ()=>{
    await cleanDb()
})

const server = supertest(app)

describe('GET/activities/:eventId', ()=>{
    it('Should respond with status 401 if no token is given', async ()=> {
        const response = await server.get('/activities/1')

        expect(response.statusCode).toBe(httpStatus.UNAUTHORIZED)
    })

    it('Should respond with status 401 if given token is not valid', async ()=>{
        const token = faker.lorem.word()

        const response = await server.get('/activities/1').set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(httpStatus.UNAUTHORIZED)
    })

    it('Should respon with status 401 if theres no session for given token', async()=>{
        const userWithNoSession = await createUser()
        const token = jwt.sign({ userId: userWithNoSession.id }, process.env.JWT_SECRET);

        const response = await server.get('/activities/1').set('Authorization', `Bearer ${token}`)

        expect(response.statusCode).toBe(httpStatus.UNAUTHORIZED)
    })

    describe('When token is valid', async ()=>{
        it('Should return status 400 if eventId is invalid', async ()=>{
            const token = await generateValidToken()

            const response = await server.get('/activities/batata').set('Authorization', `Bearer ${token}`)

            expect(response.statusCode).toBe(httpStatus.BAD_REQUEST)
        })

        it('Should return status 404 if event doesnt exist', async ()=>{
            const token = await generateValidToken()

            const response = await server.get('/activities/1').set('Authorization', `Bearer ${token}`)

            expect(response.statusCode).toBe(httpStatus.NOT_FOUND)
        })

        it('Should return status 200 if event exists', async ()=>{
            const token = await generateValidToken()
            const event = await createEvent()
            
            const response = await server.get(`/activities/${event.id}`).set('Authoriaztion', `Bearer ${token}`)

            expect(response.statusCode).toBe(httpStatus.OK)
        })
    })
})