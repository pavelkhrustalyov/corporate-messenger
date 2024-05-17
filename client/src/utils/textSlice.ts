export const titleSlice = (msg: string, cupChars: number): string => {
    return msg.length > cupChars ? `${msg.slice(0, cupChars)}...` : msg;
};