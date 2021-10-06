const express = require('express')
const app = express();
const server = require('http').createServer(app);
const {Server} = require("socket.io");
const path = require('path');
const cors = require('cors')
const io = new Server(server);
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())
app.use(express.static(path.join(__dirname, 'build')));
app.use(express.urlencoded({extended: true}))

const rooms = new Map()
app.get('/rooms/:id', (req, res) => {
    const roomId = req.params.id
    const obj = rooms.has(roomId)
        ? {
            users: [...rooms.get(roomId).get('users').values()],
            messages: [...rooms.get(roomId).get('messages').values()]
        }
        : {users: [], messages: []}
    res.json(obj)
});
app.get('/admin', (req, res) => {
    res.json(rooms)
});
app.post('/rooms', (req, res) => {
    const {roomId, userName, password} = req.body
    if (!rooms.has(roomId)) {
        rooms.set(
            roomId,
            new Map([
                ['password', password],
                ['users', new Map()],
                ['messages', []]
            ])
        )
    } else {
        const roomPass = rooms.get(roomId).get('password')
        if (roomPass !== password) {
            return res.status(400).json('Неверный пароль')
        }
    }
    res.send([...rooms.keys()])
})

io.on('connection', (socket) => {
    socket.on('ROOM:JOIN', ({roomId, userName}) => {
        socket.join(roomId)
        rooms.get(roomId).get('users').set(socket.id, userName)
        const users = [...rooms.get(roomId).get('users').values()]
        socket.to(roomId).emit('ROOM:JOINED', users)
    })
    socket.on('disconnect', () => {
        rooms.forEach((value, roomId) => {
            if (value.get('users').delete(socket.id)) {
                const users = [...rooms.get(roomId).get('users').values()]
                socket.broadcast.to(roomId).emit('ROOM:LEAVE', users)
            }
        })
    })
    socket.on('ROOM:NEW_MESSAGE', ({roomId, userName, text}) => {
        const obj = {userName, text, date: Date.now()}
        rooms.get(roomId).get('messages').push(obj)
        socket.broadcast.to(roomId).emit('ROOM:SET_NEW_MESSAGE', obj)
    })
});

server.listen(PORT, () => {
    console.log('listening on *:' + PORT);
});