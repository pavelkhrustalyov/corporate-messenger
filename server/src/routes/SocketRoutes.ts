import { Server, Socket } from 'socket.io';

const socketRoutes = (socket: Socket) => {
    
};

export default socketRoutes;

// socket.on("message", ({ roomId, text }: { roomId: string, text: string }): void => {
    //     io.to(roomId).emit("msg", { text, roomId, id: socket.id });
    // });

    // socket.on("joinRoom", (roomId: string): void => {
    //     console.log('join', roomId);
    //     socket.join(roomId);
    // });

    // socket.on('disconnect', () => {
    //     console.log('user disconnected');
    // });