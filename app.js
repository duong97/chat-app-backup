var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var loginRouter = require('./routes/login');
var msgRouter = require('./routes/msg');

var app = express();
const session = require('express-session');
app.use(session({
    resave: true,
    saveUninitialized: true,
    secret: 'somesecret',
    cookie: {maxAge: 60000}
}));


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));



app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/msg', msgRouter);

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

module.exports = app;

//socket.io instantiation
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {
    allowEIO3: true // false by default
});

const jwt = require('jsonwebtoken')
const userFunc = require('./models/usersFunction')

let allClients = [];
//listen on every connection
io.on('connection', (socket) => {
    allClients.push(socket);
    console.log(socket.id + ' New user connected')

    //default username
    socket.username = "Anonymous"

    //listen on new_message
    socket.on('new_message', (data) => {
        let msgContent = data.message;
        let token = data.token;
        let tokenDecode = jwt.decode(token);
        let senderId = tokenDecode ? tokenDecode.id : 0;
        let receiverId = data.to;
        const msg = require('./models/msg');
        if(senderId && receiverId){
            msg.socketSendMsg(senderId, receiverId, msgContent).then((data) => {
                io.sockets.emit('new_message', data)
            });
        }

        //broadcast the new message
        // io.sockets.emit('new_message', {message: data.message, username: socket.username});
    })

    socket.on('disconnect', () => {
        console.log(socket.id + ' Got disconnect!');

        // console.log(allClients)
        let i = allClients.indexOf(socket);
        allClients.splice(i, 1);
    })

})
//Listen on port 3000
server.listen(3000, () => {
    console.log('listening on *:3000');
})