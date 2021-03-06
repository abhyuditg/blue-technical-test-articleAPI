const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const todaysDate = new Date().toISOString().split('T')[0];

const ArticlesSchema = new Schema({
    //Assumption: id is of type String not Number
    id: {type: String, required: true},
    title: {type: String, required: true},
    date: {type: Date, default: todaysDate},
    body: {type: String, required: true},
    tags: {type: [String], required: true}
});
module.exports = mongoose.model('Articles', ArticlesSchema);