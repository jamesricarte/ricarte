const express = require("express");

const router = express.Router();

router.get("/posts", (req, res) => {
    const posts = [
        {id: 1, title: "James", content: "James content"},
        {id: 2, title: "Charles", content: "Charles content"},
        {id: 3, title: "Cedric", content: "Cedric content"},
    ]
    res.status(200).json({ message: "Posts was fetched successfully!", posts: posts})
})

module.exports = router;