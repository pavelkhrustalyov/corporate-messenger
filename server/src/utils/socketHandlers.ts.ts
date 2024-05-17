import { io } from "..";
import Message from "../models/Message";
import Room from "../models/Room";

type readMessageData = { roomId: string, userId: string };

export const readMessage = async ({ roomId, userId }: readMessageData) => {
    const room = await Room.findById(roomId);

    if (!room) {
        throw new Error('Чат не найден!');
    }

    await Message.updateMany(
        { roomId, senderId: { $ne: userId }, isRead: false },
        { isRead: true }
    );
    
    const updatedMessages = await Message.find({ roomId })
        .populate({ path: 'senderId', select: 'name surname avatar status' })
    
    
    const updatedRoom = await Room.findById(roomId)
        .populate({ path: 'participants', select: '_id name surname avatar status last_seen' })
        .populate({ path: 'creator', select: '_id name surname avatar status last_seen' })
        .populate({ path: 'messages', select: 'senderId isRead' });

    // io.to(roomId).emit('read-messages-server', { messages: updatedMessages, room: updatedRoom, userId });
  }