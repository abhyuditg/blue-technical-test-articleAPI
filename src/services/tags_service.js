const express = require('express');
const { rules } = require('nodemon/lib/rules');
const router = express.Router();
const Articles = require('../model/Articles');
const Tags = require('../model/Tags');

/* tag: {type: String, required: true},
    count: {type: Number, required: true},
    articles: {type: [Number], required: true},
    related_tags: {type: [String]} */

router.get('/tags/:tagName/:date', async (req,res) => {
    try{
        const tagName = req.params.tagName;
        if(tagName==null){
            throw new Error('You must provide a tag name');
        }
        const formattedDate = convertDateFormat(req.params.date);
        if(formattedDate=="Invalid Date") {
            throw new Error(formattedDate);
        }
        const getTags = await Articles.find({'tags': tagName}).find({'date': formattedDate});        
        if(getTags.length==0) {
            res.status(200).send({message: `No match found for ${tagName} on ${formattedDate}`});
        }
        const resultTags = summary(getTags, tagName);
        
        res.status(200).json(resultTags);
    } catch(err) {
        res.json({message: err.message});
    }
});

function summary(getTags, tagName) {
    var articlesArray = [];
    var relatedTags = [];

    for (let articleid of getTags)
        articlesArray.push(articleid.id);
    
    for (let tag of getTags)
        for(let tagN of tag.tags){
            if(tagN == tagName) continue;
            if(tagN in relatedTags) continue;
            relatedTags.push(tagN)
        }

    const resultTags = new Tags({
        tag: tagName,
        count: getTags.length, 
        articles: articlesArray,
        related_tags: relatedTags
    });
    return resultTags;
}

function convertDateFormat(toChange) {
    const reg = /^(\d{4})(\d{2})(\d{2})$/;
    var date = "";
    if(reg.test(toChange)){
        var dd = toChange.match(reg);
        date = dd[1]+"-"+dd[2]+"-"+dd[3]; 
    } else{
        return "Invalid Date"
    }
    return date;
}

module.exports = router;