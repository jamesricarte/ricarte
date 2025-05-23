const mongoose = require('mongoose');

const postSchema = mongoose.Schema({
    title: {type: String, required: true},
    content: {type: String, required: true},
    imagePath: {type: String, required: false},
    creator: {type: mongoose.Schema.Types.ObjectId,   
    ref: "user", required: true}  
})

module.exports = mongoose.model("Post", postSchema);