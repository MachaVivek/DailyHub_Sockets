const express = require('express');
const socketio= require('socket.io');
const cors = require('cors');
const router = require('./router');
const { addUser, removeUser, getUser, getUsersInRoom } = require('./users');


const port= 6000;
const app = express();

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST'],
}));

const io= require("socket.io")(4000,{
    cors:{ 
        origin:"*"
    }
})

// socket connection for starting real time communication
io.on('connection',(socket)=>{
    //  this is realted to the socket.emit in client with name 'join'
    // as third parameter we have a callback which send information to client
    socket.on('join',({name,room},callback)=>{
        console.log(name,room);
        const {error,user}= addUser({id:socket.id,name,room});
        if(error){
            return callback(error);
        }

        socket.emit('message',{
            user:'admin',
            text:`${user.name}, welcome to the room ${user.room}`
        });

        // this send message to all the other users in the same room
        socket.broadcast.to(user.room).emit('message',{
            user:'admin',
            text:`${user.name} has joined!`
        });

        socket.join(user.room);
        
        callback();
    })

    // we wait for the message from the client
    socket.on('sendMessage',(message,callback)=>{
        const user= getUser(socket.id);
        io.to(user.room).emit('message',{
            user:user.name,
            text:message
        })
        callback();
    })

    // for disconnecting user
    socket.on('disconnect',()=>{
        console.log('user disconnected');
        const user= removeUser(socket.id);
        if(user){
            io.to(user.room).emit('message',{
                user:'admin',
                text:`${user.name} has left`
            })
        } 
    })
})
app.use(router)

app.listen(port, () => console.log(`Server running on port ${port}`));
