// server to handle socket io connections
const io = require('socket.io')(4000, {
    cors: {
      origin: '*',
    }
  });

const users = {};

io.on('connection', socket => {
  // if new user joins let other users know
    socket.on('new-user-joined', name => {
        console.log(`welcome to Glory's chatroom`, name);
        users[socket.id] = name;
        socket.broadcast.emit('user-joined', name);
    });
  // if a message is sent receive it and show to others (broadcast to other people)
    socket.on('send', message => {
        socket.broadcast.emit('receive', {message: message, name: users[socket.id]});
    });
  // if a user leaves let others know
    socket.on('disconnect', message => {
      socket.broadcast.emit('left',users[socket.id]);
      delete users[socket.id];
    });
});