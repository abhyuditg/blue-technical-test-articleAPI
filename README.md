# blue-technical-test-articalAPI
Documentation for https://ffxblue.github.io/interview-tests/test/article-api/ includes: 
* Source Code
* Setup/Installation
* Solution and reason to my approach 
* Testing
* Error handling
* Assumptions
* My thought of the technical test
* Future improvements

## 1. Source Code

Please find the source code in folder src.
The api's has been created using node.js, express, mongoose. Testing done with supertest and jest.
Model folder contains the schema for Articles and Tags. This schema is then used by services.
Services include routes and 3 endpoints for articles and tags which are don ein articles_service.js and tags_service.js.
Tests folder contains test.js
app.js connects to mongoDB and has middleware to use the service.

## 2. Setup/Installation

The code was done in Windows 10 system using vscode.
The application first connects to the Database and then sets up the localhost server at port 3000.
Localhost server was used for this test for simplesity. I could have used other servers like Heroku as well.
* Requirements: *

* Node js
* npm

Run: 
```
npm start
```

Test: 
```
npm test
```

## 3. Solution and reason to my approach

The solutions tries to follow MVC (Model-View-controller) design principle.

I choose Node JS as I am confident in using Javascript and have professional experience in using Node js and express for creating RESTful APIs.
I have started learning Go language as that is where I will mostly be working on if I get the developer role.

To store data:
I prefered using mongoDB and not using it within the service using SQL tables.
NoSql cloud database was preferred as in real-world system, database implementation is better as it requires dealing with loads of data.
Best option for optimal cost and timing is AWS DynamoDB. Having experience with AWS DynamoDB I still didn't choose it as it might be a little difficult to run on someone else's system.
I used mongoDB with mongoose as that was a new database implementation for me and is fairly simple to setup and cost and time efficient.

I have tried to use the YAGNI principle. However, I created an extra endpoint '/articles/delete' which deletes all documentation in a collection, this helps during testing. Total 4 endpoints.

## 4. Testing

Jest and supertest has been implemented. Tests folder has test.js.
Considering the simple complexity of the application not much rigours testing has been done with unit tests. When the source code is bigger and has more requirements and deliverables, more test files will be created which will ensure maximum code coverage. Testing of ErrorHandling was not done properly and only statuscode was checked, not the message.

## 5. Error Handling

Error handling is very important in any service. I have used http-errors for creating my own 404 and 422 error handling. Overall, error handling could have been improved in this application. Had I had more time, I would have focused on the same by showing appropriate messages with status code for different edge cases and also creating new ErrorTypes.

## 6. Assumptions

A Couple of Assumption were made in this application as the spec was not very detailed and loose, which is a case in most client provided requests.
* 'id' in Article Schema is of type String.
* Extra '_id' attribute in the result is okay. It can be removed by using ```.find({},{_id: 0})``` on database model. This _id is created by mongoDB.
* POST '/articles' receives the article data in body of the request.
* "count" attribute in Tags Schema shows the total number of articles with the tagName on params.date.
* 'date' attribute is saved without the time of article creation, but has a timestamp of T00:00:00.000Z when stored in mongoDB.
* All article properties are required in Schema with default for date to current Date.
* if tagName and date are valid params and no found is match, 'count', 'related_tags' and 'articles' will be 0, [] and [] respectively.


## 7. My thoughts of the technical test

It's was fun doing the test and also helped me practice nodeJS and especially learn mongoDB implementation. The source code part of the test was simple for me after making my assumptions. It took me 8-9 hours to complete the work. Creating the test files for the service was a little challenging and something I am not a fan of but I know is a must. It was my first time trying to get my hands on docker containers, that used some of my time and in the end my docker image was not working as required. Had I had more time I would have submitted the docker image as well for easy compilation on the testers system.


## 8. Future improvements

Had I had more time, I would have worked on improving the structure of the application. Would have made the service Production Ready and would have definitely created more test cases with unit tests.
I would have implemented docker containers efficiently so that the tester can easily run the service on their system.