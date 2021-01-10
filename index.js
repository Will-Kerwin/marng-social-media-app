const { ApolloServer, PubSub } = require("apollo-server");
const mongoose = require("mongoose");

const typeDefs = require("./graphql/typeDefs");
const resolvers = require("./graphql/resolvers");
const { MONGODB, PORT } = require("./config.js");

// subscriptions
const pubsub = new PubSub();

// Create and establish server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({req}) => ({req, pubsub})
});

// Connect to mongo database
mongoose
  .connect(MONGODB, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Mongodb Connected");
    return server.listen({ port: PORT });
  })
  .then((res) => {
    console.log(`Server running at ${res.url}`);
   })
   .catch(err => {
     console.error(err);
   })
