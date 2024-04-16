import mongoose from "mongoose";

const dbConnect = async () => {
    try {
        await mongoose.connect(process.env.DB_DEV as string);
    } catch (error) {
        console.log(error);
    }
};

export { dbConnect };