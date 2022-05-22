const express = require('express');
const router = express.Router();
const Articles = require('../model/Articles');
//var moment = require('moment');


//Routes
//get all articles in DB
//TODO remove
router.get('/articles', async (req, res) => {
    try {
        const getArticles = await Articles.find();
        res.status(200).json(getArticles);
    } catch (err) {
        res.json({message: err.message});
    }
});

router.get('/articles/:id', async (req, res) => {
    
    try {
        //mongoose function to find and return required data set
        const getArticles = await Articles.findOne({'id': req.params.id});
        if(!getArticles)
            throw new Error(`No Articles with id ${req.params.id} found`);
        res.status(200).json(getArticles);
    } catch (err) {
        res.json({message: err.message});
    }
});

// Assumption: Article data is given in body and then rendered by the end
router.post('/articles', async (req, res) => {
    const article = new Articles({
        id: req.body.id,
        title: req.body.title,
        date: req.body.date,
        body: req.body.body,
        tags: req.body.tags
    });

    try {
        console.log(req.body.tags);
        if(req.body.tags == null && req.body.tags.length == 0){
            throw new Error('Tags cannot be empty');
        }
        
        if(req.body.date == ""){
            throw new Error('Date cannot be null');
        }

        if(req.body.id <= 0)
            throw new Error('Id cannot be negative or zero');
        const articleID = await Articles.findOne({'id': req.body.id});
        if(articleID)
            throw new Error(`Article ${articleID.id} already exists`);
        
        var postedArticles = await article.save(); //saving in DB
        
        res.status(200).json(postedArticles);
        
    } catch (err) {
        res.json({message: err.message});
    }
});


module.exports = router;