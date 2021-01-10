# MERNG Stack Social Media app
 learning new techonologies like graphql while also making something useful

### Backend 

The backend is developed in javascript or more specifically NodeJS using [Apollo Server](https://www.apollographql.com/) Utilising it's GraphQL feature's.

It's key features involve:

- using a mongodb database to store it's data

- using JSON web tokens to authenticate user's

- hashing passwords on creation to ensure security

### Deployment

### Problems encountered

deoplying non master branches to heroku require the following syntax git push heroku <branchname>:master

config.js didn't want connection string on public repo work around was use heroku local to be enviromentally aware