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
import User, { IUserSchema } from './models/User';

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

// const sockets: Sockets = {};

// socket routes
io.on('connection', async (socket: Socket) => {
  
  socket.on("join-room", (roomId) => {
    socket.join(roomId);
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

  socket.on("leave-room", (roomId) => {
    socket.leave(roomId);
  })

  socket.on("typing", (data: typingData) => {
    socket.to(data.roomId).emit("set-typing", data)
  })

  socket.on("disconnect", () => {
  })
});

// error handlers
app.use(notFound);
app.use(errorHandler);

server.listen(process.env.PORT, () => {
    console.log(`listening on ${process.env.PORT}`);
});

 // if (userId) {
  //   socket.join(userId);
  // }

  // socket.on('connect-user', async (userId: string) => {
  //   const user: IUserSchema | null = await User.findByIdAndUpdate(userId, {
  //     $set: { status: "Online" }
  //   });
  // })

  // socket.on('connect-user', async (userId: string) => {
  //   console.log('connect')
  //   const user: IUserSchema | null = await User.findByIdAndUpdate(userId, {
  //     $set: { status: "Online" }
  //   });
  // })

  // socket.on('disconnect-user', async (userId: string) => {
  //   console.log('disconnect')
  //   const user: IUserSchema | null = await User.findByIdAndUpdate(userId, {
  //     $set: { status: "Offline" }
  //   });
  // })
