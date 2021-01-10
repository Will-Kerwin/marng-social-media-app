import React from "react";
import App from "./App";
import {ApolloClient, InMemoryCache, createHttpLink, ApolloProvider} from "@apollo/client";
import {setContext} from "@apollo/client/link/context";


// creates a link with the server
const httpLink = createHttpLink({
    uri: "https://kd-merng-social.herokuapp.com/"
})

// adds the authorization to header so we can access restricted routes
const authLink = setContext(() => {
    const token = localStorage.getItem("token");
    return {
        headers:{
            Authorization: token ? `Bearer ${token}` : ''
    }};
})

// creates the apollo client we use in the application with accessing cache and all 
const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache()
})

// returns this to index.js so the whole app is wrapped in provider
export default (
    <ApolloProvider client={client}>
        <App/>
    </ApolloProvider>
)