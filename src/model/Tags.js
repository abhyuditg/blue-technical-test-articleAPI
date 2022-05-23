const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TagsSchema = new Schema({
    tag: {type: String, required: true},
    count: {type: Number, required: true},
    articles: {type: [String], required: true},
    related_tags: {type: [String]}
});

module.exports = mongoose.model('Tags', TagsSchema);