
const app = require('../../app');
const request = require('supertest');

describe('DELETE "/articles/delete', () => {
    it('delete all articles', () => {
        return request(app).delete('/articles/delete')
        .expect(200)
        .then((response) => {
            expect(response.body.acknowledged).toEqual(true)
        });
    })
})

describe('POST "/articles"', () => {
    
    it('check the return after successful POST', () => {  
        return request(app)
            .post('/articles').send({
                    "id": "1",
                    "title": "latest science shows that potato chips are better for you than sugar",
                    "date" : "2016-09-22",
                    "body" : "some text, potentially containing simple markup about how potato chips are great",
                    "tags" : ["health", "fitness", "science"]
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        id: "1",
                        title:"latest science shows that potato chips are better for you than sugar",
                        date: "2016-09-22T00:00:00.000Z",
                        body: "some text, potentially containing simple markup about how potato chips are great",
                        tags: ["health", "fitness", "science"],
                        _id: expect.any(String),
                        __v: 0
                    }),
                )
            })
    });

    it('missing parameters: id', () => { return request(app)
        .post('/articles').send({
                "title": "latest science shows that potato chips are better for you than sugar",
                "date" : "2016-09-22",
                "body" : "some text, potentially containing simple markup about how potato chips are great",
                "tags" : ["health", "fitness", "science"]
        })
        .expect(404)
    });

    it('missing parameters: title', () => { return request(app)
        .post('/articles').send({
                "id": "2",    
                "date" : "2016-09-22",
                "body" : "some text, potentially containing simple markup about how potato chips are great",
                "tags" : ["health", "fitness", "science"]
        })
        .expect(404)
    });

    it('repeated request for same id', () => {
        return request(app)
            .post('/articles').send({
                    "id": "1",
                    "title": "latest science shows that potato chips are better for you than sugar",
                    "date" : "2016-09-22",
                    "body" : "some text, potentially containing simple markup about how potato chips are great",
                    "tags" : ["health", "fitness", "science"]
            })
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        message: "Article 1 already exists"
                    }),
                )
            })
    })
})


describe('GET "/articles/:id"', () => {
    it('check the return after successful GET', () => { 
        return request(app)
            .get('/articles/1')
            //.expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.arrayContaining([
                        expect.objectContaining({
                            id: expect.any(String),
                            title: expect.any(String),
                            date: expect.any(String),
                            body: expect.any(String),
                            tags: expect.any(Array),
                            _id: expect.any(String)
                        }),
                    ])
                )
            })
    });

    it('404 out of bound id', () => { 
        return request(app).get('/articles/2313').expect(404);
    });

    it('422 with incorrect id', () => { 
        return request(app).get('/articles/asAS').expect(422);
    });

    it('422 with non positive id', () => { 
        return request(app).get('/articles/-1').expect(422);
    });

    it('404 with empty id', () => { 
        return request(app).get('/articles/').expect(404);
    });

})

describe('POST "/articles" for testing GET /tags/..', () => {
    it('2bunch of successful article POST', () => {
        return request(app)
            .post('/articles').send({
                "id": "2",
                "title": "Title 2",
                "date" : "2016-09-22",
                "body" : "abc",
                "tags" : ["health", "fitness", "science", "technology"]
            })
            .expect('Content-Type', /json/)
            .expect(200)   
    })
    it('3bunch of successful article POST', () => {
        return request(app)
            .post('/articles').send({
                    "id": "3",
                    "title": "Title 3",
                    "date" : "2022-05-23",
                    "body" : "abc",
                    "tags" : ["health", "science", "technology"]
            })
            .expect('Content-Type', /json/)
            .expect(200)   
    })
    it('4bunch of successful article POST', () => {
        return request(app)
            .post('/articles').send({
                    "id": "4",
                    "title": "Title 4",
                    "date" : "2022-05-23",
                    "body" : "abc",
                    "tags" : ["science", "business", "real-estate"]
            })
            .expect('Content-Type', /json/)
            .expect(200)   
    })
    it('5bunch of successful article POST', () => {
        return request(app)
            .post('/articles').send({
                    "id": "5",
                    "title": "Title 5",
                    "date" : "2022-05-23",
                    "body" : "abc",
                    "tags" : ["science", "business", "real-estate"]
            })
            .expect('Content-Type', /json/)
            .expect(200)   
    })

    it('6bunch of successful article POST', () => {
        return request(app)
            .post('/articles').send({
                    "id": "6",
                    "title": "Title 6",
                    "date" : "2016-09-22",
                    "body" : "abc",
                    "tags" : ["science", "business", "real-estate"]
            })
            .expect('Content-Type', /json/)
            .expect(200)   
    })

    it('7bunch of successful article POST', () => {
        return request(app)
            .post('/articles').send({
                    "id": "7",
                    "title": "Title 7",
                    "date" : "2016-09-22",
                    "body" : "abc",
                    "tags" : ["science", "technology", "business"]
            })
            .expect('Content-Type', /json/)
            .expect(200)   
    })
    it('8bunch of successful article POST', () => {
        return request(app)
            .post('/articles').send({
                    "id": "8",
                    "title": "Title 8",
                    "date" : "2016-09-22",
                    "body" : "abc",
                    "tags" : ["business"]
            })
            .expect('Content-Type', /json/)
            .expect(200)   
    })

})

describe('GET "/tags/:tagName/:date"', () => {
    it('check the return after successful GET v0', () => { 
        return request(app)
            .get('/tags/health/20160922')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        "tag": "health",
                        "count": 2,
                        "articles": [
                            "1",
                            "2"
                        ],
                        "related_tags": [
                            "fitness",
                            "science",
                            "technology"
                        ],
                        "_id": expect.any(String)
                        }),
                )
            })
    });

    it('check the return after successful GET v1', () => { 
        return request(app)
            .get('/tags/business/20220523')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        "tag": "business",
                        "count": 2,
                        "articles": [
                            "4",
                            "5"
                        ],
                        "related_tags": [
                            "science",
                            "real-estate"
                        ],
                        "_id": expect.any(String)
                        }),
                )
            })
    });

    it('check the return after successful GET v2', () => { 
        return request(app)
            .get('/tags/real-estate/20220523')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        "tag": "real-estate",
                        "count": 2,
                        "articles": [
                            "4",
                            "5"
                        ],
                        "related_tags": [
                            "science",
                            "business"
                        ],
                        "_id": expect.any(String)
                        }),
                )
            })
    });

    it('check the return after successful GET v3', () => { 
        return request(app)
            .get('/tags/business/20160922')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        "tag": "business",
                        "count": 3,
                        "articles": [
                            "6",
                            "7",
                            "8"
                        ],
                        "related_tags": [
                            "science",
                            "real-estate",
                            "technology"
                        ],
                        "_id": expect.any(String)
                        }),
                )
            })
    });

    it('check no result found', () => { 
        return request(app)
            .get('/tags/health/20170920')
            .expect('Content-Type', /json/)
            .expect(200)
            .then((response) => {
                expect(response.body).toEqual(
                    expect.objectContaining({
                        "tag": "health",
                        "count": 0,
                        "articles": [],
                        "related_tags": [],
                        "_id": expect.any(String)
                        }),
                )
            })
    });

    it('422 incorrert date format v0', () => {
        return request(app)
        .get('/tags/health/2016-09-22')
        .expect(422)
    });

    it('422 incorrert date format v1 nonleap year', () => {
        return request(app)
        .get('/tags/health/20170229') //leap year
        .expect(422)
    });

    it('missing attribute', () => { 
        return request(app)
        .get('/tags//20160922')
        .expect(404)
    });

})

