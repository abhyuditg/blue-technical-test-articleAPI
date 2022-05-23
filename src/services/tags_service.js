const express = require('express');
const router = express.Router();
const Articles = require('../model/Articles');
const Tags = require('../model/Tags');
const createError = require('http-errors');

/* GET summary of tagName which has a article on the given date */
router.get('/tags/:tagName/:date', async (req,res, next) => {
    res.set('Content-Type', 'application/json');
    try{
        const tagName = req.params.tagName;
        if(tagName==null){
            //404 Not found
            return next(createError(404, 'You must provide a tag name'));
        }
        const formattedDate = convertDateFormat(req.params.date);
        if(formattedDate == 0) {
            //422
            return next(createError(422, 'Invalid Date, match YYYYMMDD'));
        }
        var getTags = await Articles.find({'tags': tagName}).find({'date': formattedDate});       
        getTags.map(function(getTags){
            delete getTags._id;
            return getTags;
        });

        const resultTags = summary(getTags, tagName);
        res.status(200).json(resultTags);
    } catch(err) {
        res.json({message: err.message});
    }
});

/* helper function for finding the summary for the Tags by finding articles that have the tag and relatedTags */
function summary(getTags, tagName) {
    var articlesArray = [];
    var relatedTags = [];

    for (let articleid of getTags)
        articlesArray.push(articleid.id);

    //sorting in descending order by date/time of posting article.
    //Assumption: here the article wont be sorted as the date is same as we are not considering timestamp. time is set to 00:00:00 for all articles
    articlesArray.sort((a, b) => {
        return b.date - a.date;
    });

    for (let tag of getTags)
        for(let tagN of tag.tags){
            if(tagN == tagName) continue;
            if(relatedTags.includes(tagN)) continue;
            relatedTags.push(tagN)
        }

    const resultTags = new Tags({
        tag: tagName,
        count: getTags.length, 
        articles: articlesArray.splice(0,10), //only outputing the latest 10 articles
        related_tags: relatedTags
    });

    return resultTags;
}

/* ConvertDate to YYYY-MM-DD after checking its validity. */
function convertDateFormat(toChange) {
    const reg = /^(\d{4})(\d{2})(\d{2})$/;
    var date = "";
    //check if the date provided is valid and matches the regex with only 8 continous digits
    if(validDate(toChange) && reg.test(toChange)){
        var dd = toChange.match(reg);
        date = dd[1]+"-"+dd[2]+"-"+dd[3]; 
    } else{
        return 0;
    }
    return date;
}


/* Source reference: https://jymden.com/javasscript-validate-date-in-format-yyyy-mm-dd/ */
function validDate(date) {
    // Parse integer values from date string
    var year = parseInt(date.substr(0, 4));
    var month = parseInt(date.substr(4, 2));
    var day = parseInt(date.substr(6, 2));
    
    // Define number of days per month
    var daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

    // Adjust for leap years
    if (year % 400 == 0 || (year % 100 != 0 && year % 4 == 0)) {
        daysInMonth[1] = 29;
    }

    // check month and day range
    if (month < 1 || month > 12 || day < 1 || day > daysInMonth[month - 1]) {
        return false;
    }

    return true;
}

module.exports = router;