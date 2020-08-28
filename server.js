const express = require('express');
const app = express();
const server = require('http').Server(app);
const {v4 : uuid4} = require('uuid');
const io = require('socket.io')(server)
const { ExpressPeerServer } = require ('peer');

const peerServer = ExpressPeerServer(server, {
    debug: true
})


app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use('/peerjs', peerServer);


app.get('/', (req, res)=> {
    // res.status(200).send('Hello World!');
    // res.render('room');
    res.redirect(`/${uuid4()}`)
})

app.get('/:room', (req, res)=>{
    res.render('room', { roomId: req.params.room })
})

io.on('connection', socket => {
    socket.on('join-room', (roomId, userId) => {
        console.log('Hey, we have joined the room!', roomId);
        socket.join(roomId);
        socket.to(roomId).broadcast.emit('user-connected', userId);

        // receive the message sent by the user
        socket.on('message', message =>{
            io.to(roomId).emit('createMessage', message);
        })
    })
})


server.listen(process.env.PORT||3030);