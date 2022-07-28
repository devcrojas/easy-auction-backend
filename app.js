var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const bodyParser = require('body-parser');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var authRouter = require('./routes/auth');
var middlewareAuth = require('./middleware/auth');
var points = require('./routes/points');
const mongoose = require('mongoose');
var middlewareAuthClass = new middlewareAuth();
const socketIo = require("socket.io");
var Product = require("./model/product")
var Points = require("./model/points")

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'html');

// MW
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// PATH hacia storage local
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use(cors());
//app.use(middlewareAuthClass.validateLogin());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const URI = 'mongodb+srv://easyauction:easysoft@cluster0.tuva4.mongodb.net/Easy?retryWrites=true&w=majority';

mongoose.connect(URI, { useNewUrlParser: true, dbName: "Easy" })
  .then(db => console.log('BD Conectada'))
  .catch(error => console.error(error));

app.use(express.static(path.join(__dirname, "../easy-auction-frontend/build")));

// Routes
app.use('/api/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/profiles', require('./routes/profiles'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/products', require('./routes/products'));
app.use('/api/offers', require('./routes/offers'));
app.use('/api/points', require('./routes/points'));
app.use('/api/auth', authRouter);

app.get("*", (req, res) => {
  res.sendFile(
    path.join(__dirname, "../easy-auction-frontend/build/index.html")
  );
});
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Imagenes estaticas
app.use("/uploads", express.static('uploads'))

/*/app.listen(8080, () => {
  console.log("Server running in port 8080");
});/*/

const http = require("http");
const server = http.createServer(app);
const io = socketIo(server);

let interval;
let intervalPoints;
let conections = 0;

io.on("connection", (socket) => {
  conections ++;
  console.log("New client connected num connected: " + conections);
  if (interval) {
    clearInterval(interval);
  }
  if (intervalPoints) {
    console.log("limpiando interval");
    clearInterval(intervalPoints);
  }
  interval = setInterval(() => getApiAndEmit(socket), 1000);
  intervalPoints = setInterval(() => pointsSocket(socket), 2000);
  socket.on("disconnect", (reason) => {
    conections --;
    console.log("Client disconnected " + reason + " sobran: " + conections);
    clearInterval(interval);
    clearInterval(intervalPoints);
  });
});

const pointsSocket = async (socket)=>{
  let data = await Points.find();
  //console.log(data);  

  data.map((value, index) =>{
    
      io.emit("points-"+value._id, value);
    
  });
}

//pointsSocket();
const getApiAndEmit = async (socket) => {
  console.log(socket.id);
  //console.time()
  const response = await Product.find({ status: "active" }).populate([
    { path: 'profile', model: 'Profile'}
  ]);
  //console.timeEnd()
  //console.log("response...");
  //console.log(await Product.find())
  // Emitting a new message. Will be consumed by the client
  io.emit("FromAPI", response);
};



server.listen(8080, () => console.log(`Listening on port 8080`));
module.exports = app;
