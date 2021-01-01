const postsResolvers = require("./posts");
const { Mutation } = require("./users");
const usersResolvers = require("./users");
const commentsResolvers = require("./comments");

module.exports = {
    Query: {
        ...postsResolvers.Query
    },
    Mutation:{
        ...usersResolvers.Mutation,
        ...postsResolvers.Mutation,
        ...commentsResolvers.Mutation
    }
}