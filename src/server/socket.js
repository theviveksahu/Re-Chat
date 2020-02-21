const { addUser, removeUser, getUser } = require('./users');
const db = require('./db');

const socketConfig = (io) => {
    let messages = [];
    io.on('connection', (socket) => {
        socket.on('join', ({username, selectedChannel}, callback) => {
            console.log(`${username} joined ${selectedChannel}`);
            const { user } = addUser({id:socket.id, username, selectedChannel});
            socket.join(user.selectedChannel);
    
            callback();
        })
    
        socket.on('sendMessage', (data) => {
            messages.push(data);
            setTimeout(() => {
                if (messages.length > 0) {
                    let req = { body: messages }
                    db.connectDB('saveConversation', req);
                    messages = [];
                }
            }, 1000)
            const user = getUser(socket.id);
            io.to(user.selectedChannel).emit('message', data)
        })
    
        socket.on('disconnect', () => {
            removeUser(socket.id);
            console.log('disconnected');
        })
    })
}

module.exports = {
    socketConfig
};