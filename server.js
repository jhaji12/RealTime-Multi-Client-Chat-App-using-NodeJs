//Node Server which will handle socket io connection
const express= require('express')
const app= express()
const http = require('http').createServer(app)

const PORT = process.env.PORT || 8000

http.listen(PORT,() => {
 console.log(`Listening on port ${PORT}`)
})

app.use(express.static(__dirname+'/public'))

app.get('/',(req,res)=> {
res.sendFile(__dirname+'/index.html')
})
const users = {};

const io= require('socket.io')(http)

io.on('connection',(socket)=> {
console.log("Connected....")
  socket.on('new-user-joined',name => {
  console.log("New-user",name);
  users[socket.id] = name;
  socket.broadcast.emit("user-joined",name);
});

socket.on("send",message => {
 socket.broadcast.emit('receive',{name: users[socket.id],message: message})
 });

socket.on('disconnect',message => {
  socket.broadcast.emit('left', users[socket.id])
  delete users[socket.id];
});
});