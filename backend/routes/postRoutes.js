const express = require("express");
const multer = require("multer");

const router = express.Router();

const Post = require('../models/post');
const checkAuth = require("../middleware/check-auth");  

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpeg': 'jpg',
    'image/jpg': 'jpg'
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const isValid = MIME_TYPE_MAP[file.mimetype];
        let error = new Error("Invalid Mime Type");
        if (isValid) {
            error = null;
        }
        cb(error, "backend/images");
    },
    filename: (req, file, cb) => {
        const name = file.originalname.toLowerCase().split(' ').join('_');
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, name+ '-' + Date.now() + '.' + ext);
    }
});  

router.post("/", checkAuth, multer({storage: storage}).single("image"), (req, res, next) => {
    const url = req.protocol + '://' + req.get("host");

    const post = new Post({
        title: req.body.title,
        content: req.body.content,
        imagePath: url + "/images/" + req.file.filename,
        creator: req.userData.userId  
    })
    post.save().then(result => {
        res.status(201).json({
            message: 'Post added successfully',
            post: {
                ...result,
                id: result._id
            }
        })
    }).catch(error => {
        res.status(500).json({  
            message: "Creating A Post Failed!"  
          });  
    })
})

router.get("/", (req, res) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.currentpage;
  const postQuery = Post.find().populate("creator", "email");

  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }

  let fetchedPosts;

  postQuery
    .then(docs => {
      fetchedPosts = docs;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: "Posts successfully fetched",
        posts: fetchedPosts,
        maxPosts: count,
      });
    })
    .catch(error => {
      res.status(500).json({
        message: "Fetching posts failed!",
        error: error,
      });
    });
});


router.get("/:id",(req, res, next)=>{  
    Post.findById(req.params.id).then(post =>{  
        if(post){  
          res.status(200).json(post);  
        }else{  
          res.status(484).json({message: 'Post not Found!'});  
        }  
      }).catch(error => {
        res.status(500).json({
            message: 'Fetching post failed!',
            error: error
        });
      })  
}); 

router.put("/:id", 
    checkAuth,
    multer({ storage: storage }).single("image"),
    (req, res, next) => {  
        console.log(req.userData)
        let imagePath = req.body.imagePath;
        if (req.file) {
            const url = req.protocol + '://' + req.get("host");
            imagePath = url + "/images/" + req.file.filename
        }

        const post = new Post({ 
            _id: req.body.id,  
            title: req.body.title,  
            content: req.body.content,
            imagePath: imagePath,
            creator: req.userData.userId
        });  
        Post.updateOne({ _id: req.params.id,   
            creator: req.userData.userId }, post).then(result => {  
            if(result.modifiedCount > 0){  
                console.log(result)
                res.status(200).json({ message: "Update successful!" });  
            }else{  
                console.log(result)
                res.status(401).json({ message: "Not Authorized!" });  
            }  
        }).catch(error => {
            res.status(500).json({  
                message: "Couldn't Update Post"  
              });  
        });  
});

router.delete("/:id", checkAuth, (req, res) => {
    console.log(req.userData)
    Post.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {  
        if(result.deletedCount > 0){  
            res.status(200).json({ message: "Delete successful!" });  
          }else{  
            res.status(401).json({ message: "Not Authorized!" });  
          }  
    }).catch(error =>{  
        res.status(500).json({  
          message: "Deletion Not Done!" ,
          error: error
        });  
      });    
}) 

module.exports = router;