const express = require('express');
const app = express();
//var http = require('http');
const HOST = 'localhost';
const PORT = 3000;
const bodyParser = require('body-parser');

const articlesRoute = require('./src/services/articles_service');
const tagsRoute = require('./src/services/tags_service');
//Middleware
app.use(bodyParser.json());

//connect to mongoDB
//the database username and password can be hidden by using dotenv library. But not doing that for this project for transparency and easy file execution
const mongoose = require('mongoose');
mongoose.connect('mongodb+srv://admin:technicaltest@cluster0.9bjmw.mongodb.net/ffxblue?retryWrites=true&w=majority', 
                    {useNewUrlParser: true, useUnifiedTopology: true})
                    .then(() => {console.log("Connected to mongoDB"); app.listen(PORT, HOST);})
                    .catch((err) => console.log("Error connecting to database: ", err))


app.use('/', articlesRoute);
app.use('/', tagsRoute);

app.get('/', (req, res) => {
    res.send("hello world")
})

module.exports = app;



