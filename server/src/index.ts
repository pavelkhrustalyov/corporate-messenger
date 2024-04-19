import express, { urlencoded } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { dbConnect } from './database/connect';

import socketRoutes from './routes/SocketRoutes';
import dotenv from 'dotenv';
import { join, resolve } from 'path';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/UserRoutes';
import authRoutes from './routes/AuthRoutes';
import adminRoutes from './routes/AdminRoutes';
import roomRoutes from './routes/RoomRoutes';
import messagesRoutes from './routes/MessageRoutes';

import { errorHandler, notFound } from './middlewares/errorModdleware';

const app = express();
const server = http.createServer(app);
app.use(express.static(join(__dirname, 'public')));
dotenv.config({ path: join(__dirname, 'config/.env')});

export const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"]
    }
});
app.use((_req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.CLIENT_URL || "http://localhost:5173");
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  next();
});

dbConnect();
app.use(express.json());
app.use(urlencoded({ extended: true }));
app.use(cookieParser());

// routes
app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/room', roomRoutes);
app.use('/api/messages', messagesRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(join(__dirname, '/client/dist')));

  app.get('*', (req, res) =>
    res.sendFile(resolve(__dirname, 'client', 'dist', 'index.html'))
  );
} else {
  app.get('/', (req, res) => {
    res.send('API is running....');
  });
}

// socket routes
io.on('connection', (socket: Socket) => {
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
  })
});

// error handlers
app.use(notFound);
app.use(errorHandler);

server.listen(process.env.PORT, () => {
    console.log(`listening on ${process.env.PORT}`);
});
