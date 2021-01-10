const Post = require("../../models/Post");
const checkAuth = require("../../util/check-auth");
const {AuthenticationError, UserInputError} = require("apollo-server");

module.exports = {
  Query: {
    //get all posts from database
    async getPosts() {
      try {
        const posts = await Post.find().sort({createdAt: -1});
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    // find by id
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error("Post not found");
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    // create a post if there is an authenticated user
    async createPost(_, {body}, context) {
      // checks for valid user
      const user = checkAuth(context);

      // throws error if no post body 
      if (body.trim() === ""){
        throw new Error("body must not be empty")
      }

      // if all checks true then creates post adding created at, so we can have timestamps
      const newPost = new Post({
          body,
          user: user.id,
          username: user.username,
          createdAt: new Date().toISOString()
      })

      // saves post to database
      const post = await newPost.save();

      //! subscription's not ideal for posts but could be used for messaging 
      context.pubsub.publish("NEW_POST", {
        newPost: post
      });

      return post;
    },
    // deletes post if the attempt is made by creator of post
    async deletePost(_, {postId}, context){
      const user = checkAuth(context);

      try{
        const post = await Post.findById(postId);
        if(user.username === post.username){
          await post.delete();
          return "Post deleted successfully";
        } else{
          throw new AuthenticationError("action not allowed");
        }
      } catch (err) {
        throw new Error(err)
      }
    },
    // this is a toggle function that will add or removed based on if user has already liked the post
    async likePost(_,{postId}, context){
      const {username} = checkAuth(context);

      const post = await Post.findById(postId);
      if(post){
        if(post.likes.find(like => like.username === username)){
            // Post already liked, unlike it 
            post.likes = post.likes.filter(like => like.username !== username);
        } else {
          // Not like, like post 
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          })
        }

        await post.save();
        return post;
      } else throw new UserInputError("post not found");
    }
  },
  // defines subscription
  Subscription: {
    newPost:{
      subscribe: (_, __, {pubsub}) => pubsub.asyncIterator("NEW_POST")
    }
  }
};
