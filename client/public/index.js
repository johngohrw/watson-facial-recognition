const socket = io('http://localhost:3000');

socket.on('connect', () => {
    console.log('connected!');
});

socket.on('boom', () => {
    console.log('boom!');
});

socket.on('disconnect', () => {
    console.log('disconnect!');
});

// test function
const boom = () => {
    console.log('boom!');
    socket.emit('boom');
}
