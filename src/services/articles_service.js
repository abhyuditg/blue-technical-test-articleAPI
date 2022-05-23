const express = require('express');
const router = express.Router();
const Articles = require('../model/Articles');
const createError = require('http-errors');
//var moment = require('moment');


//Routes
/* GET article from database with primary key(id): findId */
router.get('/articles/:findId', async (req, res, next) => {
    res.set('Content-Type', 'application/json');    
    try {
        const findId = req.params.findId;
        if(!findId) {
            //404
            return next(createError(404, `Article ID cannot be empty`));
        }
        if(isNaN(parseInt(findId, 10)) || findId <= 0) {
            //422 is validation error
            return next(createError(422, 'article_id must be a positive integer'));
        }
        //mongoose function to find and return required data set
        const getArticles = await Articles.find({'id': findId}, {__v: 0}); //hiding the __v attribute which is provided by mongoDB
        if(!getArticles || getArticles.length == 0){
            //404 not found
            return next(createError(404, `No Articles with id ${req.params.findId} found`));    
        }
        res.status(200).json(getArticles);
    } catch (err) {
        res.json({message: err.message});
    }
});

// Assumption: Article data is given in body of request
router.post('/articles', async (req, res, next) => {
    res.set('Content-Type', 'application/json');
    const article = new Articles({
        id: req.body.id,
        title: req.body.title,
        date: req.body.date,
        body: req.body.body,
        tags: req.body.tags
    });

    try {
        if(req.body.id == null){
            return next(createError(404, 'id cannot be empty'));
        }
        if(req.body.title == null){
            return next(createError(404, 'title cannot be empty'));
        }
        if(req.body.tags == null && req.body.tags.length == 0){
            //404 Not Found
            return next(createError(404, 'Tags cannot be empty'));
        }
        
        if(!req.body.date){
            return next(createError(404, 'Date cannot be null'));
        }

        if(req.body.id <= 0)
            return next(createError(404, 'Id cannot be negative or zero'));

        //Validity of req.body.date is not being checked yet.
        
        // finding if article with body.id already exists in database
        const articleID = await Articles.findOne({'id': req.body.id});
        if(articleID)
            throw new Error(`Article ${articleID.id} already exists`);
        
        var postedArticles = await article.save(); //saving in DB
        res.status(200).json(postedArticles);
    } catch (err) {
        res.json({message: err.message});
    }
});

//deletes all documents in a collection. Helps in testing
router.delete('/articles/delete', async (req, res) => {
    try{
        const articles = await Articles.deleteMany();
        console.log(`${articles.deletedCount} document(s) was/were deleted.`)
        res.status(200).json(articles);
    } catch(err){
        res.json({message: err.message});
    }
});


module.exports = router;