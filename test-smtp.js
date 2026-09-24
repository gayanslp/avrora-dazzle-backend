import net from 'net';

const socket = new net.Socket();
const host = 'smtp.gmail.com';
const port = 465;

console.log(`Attempting to connect to ${host}:${port}...`);

socket.setTimeout(5000, () => {
    console.log('❌ Connection timeout');
    socket.destroy();
});

socket.on('connect', () => {
    console.log('✅ Successfully connected to SMTP server!');
    socket.destroy();
});

socket.on('error', (err) => {
    console.log('❌ Connection error:', err.message);
});

socket.connect(port, host);