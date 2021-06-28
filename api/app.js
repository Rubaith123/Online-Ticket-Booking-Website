var express = require('express');
var createError = require('http-errors');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const config =require('./config');
// const mongoClient =require('mongodb').MongoClient; //in github they uesd MongoCLient, but it gives error
const mongoose = require('mongoose');
const cors =require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
// mongoClient.connect(config.dbHost, {  //in github they uesd MongoCLient, but it gives error
//  useNewUrlParser: true,
//  useUnifiedTopology: true,})
//  .then(client => {
//   const db = client.db(config.dbName);
//   const collection = db.collection(config.dbCollection);  
//   app.locals[config.dbCollection] = collection;
// })

mongoose.connect('mongodb+srv://sezan:sezan123@my-first-cluster.ew0un.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
     dbName: 'test1',
     userNewUrlParser: true,
     useUnifiedTropology: true,
     useFindAndModify: false,
     useCreateIndex: true,
})
.then(() => console.log('mongodb connected...'))
.catch(err => console.log(`MONGO ERROR: ${err}`));

mongoose.connection.on('error', err => {
  console.log('ERROR! mongodb after iitial connection error!');
  console.log(err);
});

mongoose.connection.on('connected', () => {
    console.log('mongodb successfully connected....');
});


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use((req, res, next) => {
  const collection = req.app.locals[config.dbCollection];
  req.collection = collection;
  next();
});

app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;