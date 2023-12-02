require('dotenv').config();
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const flash = require('connect-flash');
const passport = require('passport');
const connectDB = require("./config/database");
const ejsMate = require('ejs-mate');
const session = require('express-session');
const MongoStore = require("connect-mongo");
const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('./docs/swagger_output.json')

const app = express();



//setup session
const secret = process.env.SECRET || 'segretosupersegretissimo';
app.use(
  session({
    secret: secret,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/snm'
     }),
    cookie: {
      httpOnly: true,
      // secure: true,
      expires: Date.now() + 1000 * 60 * 60, //1 hour
      maxAge: 1000 * 60 * 60 //1 hour
  }
  })
);

require("./config/passport")(passport);

app.use(passport.initialize());
app.use(passport.session());



const indexRouter = require('./routes/index');
const usersRouter = require('./routes/usersRoutes');
const searchRouter = require('./routes/searchRoutes')
const playlistRouter = require('./routes/playlistRoutes')



// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('ejs', ejsMate)

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));




//setup flash
app.use(flash())
app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  res.locals.currentUser = req.user;
  next()
})


//routes
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/search', searchRouter);
app.use('/playlist', playlistRouter);
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerFile))

connectDB()



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
