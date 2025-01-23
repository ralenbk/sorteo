const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const numerosRoutes = require('./routes/numeros');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
    },
});

// Middlewares
app.use(cors());
app.use(express.json());
app.use('/api/numeros', numerosRoutes);

// WebSocket
io.on('connection', (socket) => {
    console.log('Usuario conectado');

    socket.on('marcarNumero', (data) => {
        socket.broadcast.emit('numeroMarcado', data);
    });

    socket.on('disconnect', () => {
        console.log('Usuario desconectado');
    });
});

// Iniciar el servidor
const PORT = process.env.PORT || 3306;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

const path = require('path');

// Servir archivos estáticos de la carpeta "public"
app.use(express.static(path.join(__dirname, 'public')));
