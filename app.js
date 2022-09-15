const express = require("express");
const app = express();
const morgan = require('morgan')

///////////////////middleware below to allow post////////
app.use(morgan('dev'))
app.use(express.json());
app.use(express.static(`${__dirname}/public}`))


app.use ((req, res, next)=>{
    req.requestTime = new Date().toLocaleString();
    next()
})

///////////////////////MAIN PAGE////////////////////////////
const AUTHOR = "Tyler Morgan";

app.get("/", (req, res) => {
  const today = new Date();
  const date = today.toLocaleString();
  res.status(200).send(`MERN Solo Project Home: ${AUTHOR} - ${date}`);
});
app.post("/", (req, res) => {
  res.send("You can post to this endpoint....");
});

app.get("/about", (req, res) => {
  res.status(200).send("Tyler Morgan");
});

/////////////mounting/////////
const tourRouter = require(`./routes/tourRoutes`)
const userRouter = require(`./routes/userRoutes`)
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/users', userRouter);

module.exports = app;