const socket = io("http://localhost:4000");

// get DOM elements in respective JS varaiables
const form = document.getElementById('send-form');
const messageInp = document.getElementById('msg');
const messageCont = document.querySelector('.chat-container');
// audio for message alerts
let audio = new Audio('chat_sound.mp3');

// ask user for his/her name 
const name = prompt('Enter your name to join');
socket.emit('new-user-joined',name);

// function will append to the chat container
const append = (message,position) => {
    const msgElmt = document.createElement('div');
    msgElmt.innerText = message;
    msgElmt.style.textAlign = 'center';
    msgElmt.classList.add('message');
    messageCont.append(msgElmt);
    if(position == 'left') {
        audio.play();
    }
};

// function will append announcements (user joined/left) to the chat container
const appendAnnounce = (message) => {
    const msgElmt = document.createElement('div');
    msgElmt.style.color = '#ffd88f';
    msgElmt.innerText = message;
    msgElmt.style.textAlign = 'center';
    messageCont.append(msgElmt);
};

// when a user joins the chat let them know
socket.on('user-joined', name => {
    appendAnnounce(`${name} joined the chat`,'right');
});

// if a sender sends a message receive it
socket.on('receive', data => {
    append(`${data.name}: ${data.message}`, 'left');
});

// if user leaves the chat let everyone know
socket.on('left', name => {
    appendAnnounce(`${name} left the chat`);
});

// if form is submitted send a message to the server
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const message = messageInp.value;
    append(`You: ${message}`, 'right');
    socket.emit('send',message);
    messageInp.value = "";
});