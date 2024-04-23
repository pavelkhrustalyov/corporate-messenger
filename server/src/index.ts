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

// socket routes
io.on('connection', async (socket: Socket) => {
  // const { userId } = socket.handshake.query;
  // const user: IUserSchema | null = await User.findByIdAndUpdate(userId, {
  //   $set: { status: "Online" }
  // });

  socket.on("join-room", (roomId) => {
    socket.join(roomId);
  })

  type typingData = { isTyping: boolean, roomId: string, name: string };

  socket.on("typing", (data: typingData) => {
    socket.broadcast.to(data.roomId).emit("set-typing", data)
  })

  // socket.on("disconnect", async () => {
  //   await user?.updateOne({ $set: { status: "Offline" } })
  // })

  socket.on("disconnect", () => {
    
  })
});

// error handlers
app.use(notFound);
app.use(errorHandler);

server.listen(process.env.PORT, () => {
    console.log(`listening on ${process.env.PORT}`);
});
