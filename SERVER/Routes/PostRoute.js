const express = require("express")
const { createPost,createComment,filterPostsByDepartment,updatePost,searchPosts,getAllPostComment,deletePost,upvote,getTopUpvotedPosts,Downvote,DeleteComment,getAllPosts,getPost } = require("../controller/PostController")
const authMiddleware = require("../Middleware/AuthMiddleware")

const router=express.Router()

router.post('/createPost',createPost)
router.post('/updatePost',updatePost)
router.delete('/DeletePost/:PostId',deletePost)
router.post('/upvote',upvote)
router.post('/downvote',Downvote)
router.get('/getPosts',getAllPosts)
router.get('/getUserPost/:authorId',getPost)
router.get('/getTopfivePosts',getTopUpvotedPosts)

router.post('/createcomment',createComment)
router.get('/getAllPostcomment',getAllPostComment)
router.delete('/DeleteComment/:CommentId',DeleteComment)
router.get('/search',searchPosts)
router.get("/filterByDepartment", filterPostsByDepartment);






module.exports=router
