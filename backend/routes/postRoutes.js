const express = require("express");
const Post = require('../models/post')

const router = express.Router();

router.post("/posts", (req, res) => {
    const post = new Post({
        title: req.body.title,
        content: req.body.content
    });

    post.save();
    res.status(201).json({
        message: 'Post added successfully'
    })
})

router.get("/posts", (req, res) => {
    Post.find().then(documents => {
        res.status(200).json({
            message: 'Posts successfully fetched',
            posts: documents
        })
    })
})

router.get("/posts/:id",(req, res, next)=>{  
    Post.findById(req.params.id).then(post =>{  
        if(post){  
          res.status(200).json(post);  
        }else{  
          res.status(484).json({message: 'Post not Found!'});  
        }  
      });  
}); 

router.put("/posts/:id", (req, res, next) => {  
    const post = new Post({  // ✅ Corrected (capitalized 'Post')
        _id: req.body.id,  
        title: req.body.title,  
        content: req.body.content  
    });  
    Post.updateOne({_id: req.params.id}, post).then(result => {  // ✅ Fixed 'Post.updateOne'
        console.log(result);  
        res.status(200).json({ message: "Update Successful!" });  
    }).catch(error => {
        res.status(500).json({ message: "Update failed!", error });
    });
});

router.delete("/posts/:id", (req, res) => {
    Post.deleteOne({_id: req.params.id }).then(result => {
        console.log(result);
        console.log(req.params.id)
        res.status(200).json({message: "Post deleted"})
    })
}) 

module.exports = router;