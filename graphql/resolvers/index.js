const postsResolvers = require("./posts");
const { Mutation } = require("./users");
const usersResolvers = require("./users");

module.exports = {
    Query: {
        ...postsResolvers.Query
    },
    Mutation:{
        ...usersResolvers.Mutation
    }
}