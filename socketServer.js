// Integración básica de socket.io en el backend
import http from 'http';
import { Server as SocketServer } from 'socket.io';
import app from './server.js';

const server = http.createServer(app);
const io = new SocketServer(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
  },
});

io.on('connection', (socket) => {
  console.log('Cliente conectado:', socket.id);
});

export { io, server };
