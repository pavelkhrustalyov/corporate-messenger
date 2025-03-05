export type TimeoutType = ReturnType<typeof setTimeout>;
export type TypingData = { isTyping: boolean, roomId: string, name: string };

export type IReplyData = { 
    senderId: string,
    messageId: string,
};

export type SelectType = { title: string, field: string };

export type Position = 
    "Security Specialist" | 
    "Systems Analyst" | 
    "QA Engineer" | 
    "Product Manager" | 
    "DevOps Engineer" | 
    "Backend Developer" | 
    "Frontend Developer" | 
    "UX/UI Designer";

export type Gender = "male" | "female";
export type Status = "Online" | "Offline";
export type Role = "user" | "admin";
export type Theme = "dark" | "light";
export type TypeRoom = "group" | "private" | "video";