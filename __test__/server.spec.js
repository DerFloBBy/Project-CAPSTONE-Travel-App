// Test the Server-Side
// * Source: https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/

const supertest = require('supertest');
const request = require('supertest');
const app = require('../src/server/server');

describe('Test the root path', () => {
    test('It should response the GET method', () => {
        return request(app)
            .get('/helloworld')
            .expect(200);
    });
});
