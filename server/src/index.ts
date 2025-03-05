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
import cors from 'cors';
import Room from './models/Room';
import Message from './models/Message';

const app = express();
const server = http.createServer(app);
app.use(express.static(join(__dirname, 'public')));
dotenv.config({ path: join(__dirname, 'config/.env') });

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
    io.to(roomId).emit('update-participants', users[roomId]);
  })

  socket.on("leave-room", (roomId) => {
    if (users[roomId]) {
      const updateRoom = users[roomId].filter(id => userId !== id);
      users[roomId] = updateRoom;
      io.to(roomId).emit('update-participants', users[roomId]);
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
    const message = await Message.findById(messageId)

    io.emit("sound-notification", { roomId, userId: message?.senderId });

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
        .populate({ path: 'messages', select: 'senderId isRead' })
        .populate({ path: 'lastMessage', select: 'senderId isRead messageType text content' });

      socket.to(roomId).emit('message-received', { message: updatedMessage, users: roomUsers, room: updatedRoom });
    }
  })

  socket.on("typing", (data: typingData) => {
    socket.to(data.roomId).emit("set-typing", data)
  })
  socket.on('offer', ({ offer, participantId, roomId }) => {
    socket.to(roomId).emit('offer', { offer, participantId });
  });

  socket.on('answer', ({ answer, participantId, roomId }) => {
      socket.to(roomId).emit('answer', { answer, participantId });
  });

  socket.on('signal', ({ roomId, candidate, participantId }) => {
      socket.to(roomId).emit('signal', { candidate, participantId });
  });

  socket.emit("users-in-rooms", users);
});


// const concatArrs = (arr1: number[], arr2: number[]) => {
//   const result: number[] = [];

//   let i = 0;
//   let j = 0;

//   while (i < arr1.length && j < arr2.length) {
//     if (arr1[i] < arr2[j]) {
//       result.push(arr1[i]);
//       i++;
//     }
    
//     if (arr1[i] > arr2[j]) {
//       result.push(arr2[j]);
//       j++;
//     }
//   }
  
//   return result;
// };

// console.log(concatArrs([1, 3, 5], [2, 4, 6, 8]));




// const deleteDuplicates = (nums: number[]) => {
//   const numMap: { [key: number]: number } = {};
  
//   for (let i = 0; i < nums.length; i++) {
//     const num = nums[i];
//     if (numMap[nums[i]]) {
//       nums.splice(i, 1);
//     }
//     numMap[nums[i]] = nums[i];
//   }
//   console.log(numMap);
//   return nums;
// };

// console.log(deleteDuplicates([1, 1, 2, 5, 2, 4, 3, 5, 2]));


// const isChar = (el: string): boolean => el.toLowerCase() !== el.toUpperCase();
// const isNumber = (el: string): boolean => !isNaN(Number(el));

// const sanitizeString = (str: string) => {
//   let newStr = '';

//   for (const el of str) {
//     if ((isChar(el) || isNumber(el)) && el !== " ") {
//       newStr += el.toLowerCase();
//     }
//   }
  
//   return newStr;
// }

// const isPalindrome = (str: string): boolean => {
//   if (str.length < 2) return true;

//   if (str[0] === str[str.length - 1]) {
//     return isPalindrome(str.slice(1, str.length - 1));
//   }

//   return false;
// };

// console.log(isPalindrome(sanitizeString("A man, a plan, a canal: Panama")));


// const deleteDuplicates = (nums: number[]) => {
//   for (let i = 0; i < nums.length; i++) {
//     if (nums[i] === nums[i + 1]) {
//       nums.splice(i, 1);
//       i = i - 1;
//     }
//   }
//   return nums;
// };

// console.log(deleteDuplicates([1, 1, 2, 2, 3, 3, 6, 6, 6, 10, 10, 50, 50, 50]));


// const isValidBrackets = (brackets: string) => {
//   const left = ['(', '[', '{'];
//   const right = [')', ']', '}'];

//   const stack = [];

//   for (const bracket of brackets) {
//     if (!stack.length && right.includes(bracket)) {
//       return false;
//     }
    
//     if (left.includes(bracket)) {
//       stack.push(bracket);
//     }

//     if (right.includes(bracket)) {
//       const indexRight = right.findIndex(brk => brk === bracket);
//       const lastBracket = stack.pop();
//       const indexLeft = left.findIndex(brk => brk === lastBracket);

//       if (indexRight !== indexLeft) {
//         return false;
//       }
//     }
//   }

//   return stack.length === 0;
// };

// console.log(isValidBrackets("(]"));


// const isUnique = (str: string) => {
//   const chars = str.split('');
//   let counter = 0;

//   for (const char of chars) {
//     const temp = chars.slice(counter + 1);
//     if (!temp.includes(char)) {
//       return counter;
//     }
//     counter += 1;
//   }

//   return null;
// };

// console.log(isUnique("leetcode"));


const user = {
  id: 1,
  name: "Иван",
  email: "ivan@example.com",
  address: {
      street: "Ленинская",
      city: "Москва",
      zipCode: "101000",
      geo: {
          lat: 55.7558,
          lng: 37.6173
      }
  },
  phoneNumbers: [
      {
          type: "домашний",
          number: "+7 (495) 123-45-67"
      },
      {
          type: "мобильный",
          number: "+7 (906) 123-45-67"
      }
  ],
  isActive: true,
  createdAt: "2022-01-01T10:00:00Z"
};


// const deepClone = (obj: any) => {
//   const newObj:any = {};

//   for (const [key, value] of Object.entries(obj)) {
//     if (typeof key === "object") {
//       newObj[key] = deepClone(value);
//     } else {
//       newObj[key] = value
//     }
//   }

//   return newObj;
// };

// const newObj = deepClone(user);

// console.log(newObj);


// const name = 'Pavel';
// let newStr = '';
// for (let i = name.length - 1; i >= 0; i -= 1) {
//   newStr += name[i]
// }

// console.log(newStr);



// error handlers
app.use(notFound);
app.use(errorHandler);

server.listen(process.env.PORT, () => {
  console.log(`listening on ${process.env.PORT}`);
});