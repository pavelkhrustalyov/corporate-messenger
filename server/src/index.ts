import express, { json, urlencoded } from 'express';
import http from 'http';
import { Server, Socket } from 'socket.io';
import { dbConnect } from './database/connect';

import dotenv from 'dotenv';
import { join, resolve } from 'path';
import cookieParser from 'cookie-parser';

import userRoutes from './routes/UserRoutes';
import authRoutes from './routes/AuthRoutes';
import adminRoutes from './routes/AdminRoutes';
import roomRoutes from './routes/RoomRoutes';
import messagesRoutes from './routes/MessageRoutes';

import { errorHandler, notFound } from './middlewares/errorModdleware';
import User from './models/User';
import { readMessage } from './utils/socketHandlers.ts';
import cors from 'cors';
import Room, { IRoomSchema } from './models/Room';
import Message, { IMessageSchema } from './models/Message';

const app = express();
const server = http.createServer(app);
app.use(express.static(join(__dirname, 'public')));
dotenv.config({ path: join(__dirname, 'config/.env')});

export const io = new Server(server, {
    cors: {
      origin: process.env.CLIENT_URL,
      methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }
});

app.use(cors({
  origin: process.env.CLIENT_URL,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

dbConnect();
app.use(json());
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

type typingData = { isTyping: boolean, roomId: string, name: string };

interface Sockets {
  [socketId: string]: string;
}

let users: { [roomId: string]: string[] } = {}

// socket routes
io.on('connection', async (socket: Socket) => {
    const userId = Array.isArray(socket.handshake.query.userId) ? socket.handshake.query.userId[0] : socket.handshake.query.userId;

    socket.on("join-room", async (roomId) => {
      if (!users[roomId])
        users[roomId] = [];
      if (userId && !users[roomId].includes(userId)) {
        users[roomId].push(userId);
      }

      socket.join(roomId);
    })

    socket.on("leave-room", (roomId) => {
      if (users[roomId]) {
        const updateRoom = users[roomId].filter(id => userId !== id);
        users[roomId] = updateRoom;
      }
      
      socket.leave(roomId);
    })

    socket.on('user-online', async (data) => {
      await User.findByIdAndUpdate(data.userId, {
        $set: { status: "Online" }
      });
      io.emit("online", data.userId);
    });

    socket.on('user-offline', async (data) => {
      await User.findByIdAndUpdate(data.userId, {
        $set: { status: "Offline", last_seen: Date.now() }
      });

      io.emit("offline", data.userId);
    });

    socket.on('is-received', async ({ roomId, messageId }) => {

      const roomUsers = users[roomId];

      if (roomUsers.length > 1) {
        const room = await Room.findById(roomId);
        if (!room) {
            throw new Error('Чат не найден!');
        }

        await Message.updateOne({ _id: messageId }, { isRead: true });
    
        const updatedMessage = await Message.findById(messageId)
            .populate({ path: 'senderId', select: 'name surname avatar status' });

        const updatedRoom = await Room.findById(roomId)
          .populate({ path: 'participants', select: '_id name surname avatar status last_seen' })
          .populate({ path: 'creator', select: '_id name surname avatar status last_seen' })
          .populate({ path: 'messages', select: 'senderId isRead' });

          socket.to(roomId).emit('message-received', { message: updatedMessage, users: roomUsers, room: updatedRoom });
      }
    })
      
    socket.on("typing", (data: typingData) => {
      socket.to(data.roomId).emit("set-typing", data)
    })
});

// error handlers
app.use(notFound);
app.use(errorHandler);

server.listen(process.env.PORT, () => {
    console.log(`listening on ${process.env.PORT}`);
});