require('dotenv').config()
const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayouts = require('express-ejs-layouts')
const PORT = process.env.PORT || 3300
const mongoose = require('mongoose')
const session = require('express-session')
const flash = require('express-flash')
const MongodbStore = require('connect-mongo')(session)


//database connection
const url = 'mongodb://localhost/pizza';
mongoose.connect(url, { useNewUrlParser:true, useCreateIndex:true, useUnifiedTopology:true, useFindAndModify : true });
const connection = mongoose.connection;
connection.once('open', () => {
  console.log('Database connected...');
}).catch(err => {
  console.log('Connection failed...')
});

//Session store
let mongoStore = new MongodbStore({
                mongooseConnection: connection,
                collection: 'sessions'
})
//Session config
app.use(session({
  secret: process.env.COOKIR_SECRET,
  resave: false,
  store: mongoStore,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 24 } // 24 hour
}))

app.use(flash())
//Assets
app.use(express.static('public'))
app.use(express.json())

// Globel middleware
app.use((req, res, next) => {
  res.locals.session = req.session
  next()
})
// set Template engine
app.use(expressLayouts)
app.set('views', path.join(__dirname, '/resources/views'))
app.set('view engine', 'ejs')

require('./routes/web')(app)

app.listen(PORT , () => {
    console.log(`Listening on port ${PORT}`)
})
