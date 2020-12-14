const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { graphqlHTTP } = require('express-graphql');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();



const graphQlSchema = require("./graphql/schema/index");
const graphQlResolvers = require("./graphql/resolvers/index");

const authenticate = require("./auth.js");


app.use(bodyParser.json());
app.use(cookieParser());
app.use(function(req, res, next) {
    res.set({
        'Access-Control-Allow-Origin':'http://localhost:3000',
        'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept',
        'Access-Control-Request-Method': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Credentials': 'true',
    })
    next();
});
app.use("/auth", authenticate.routes);



mongoose.connect(`${process.env.MONGO_URL}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  }).then(() => {
app.listen(8000);

app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if(req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// app.use(isAuth);


app.options('*', cors());

app.use(
    '/graphql',
    graphqlHTTP({
        schema: graphQlSchema,
        rootValue: graphQlResolvers,
        graphiql: true
    })
);

});
