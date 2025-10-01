import mongoose from "mongoose";
import colors from "colors";
import dotenv from "dotenv";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI;

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log(colors.cyan(`[Database] MongoDB connected: ${conn.connection.host}`));
    } catch (error) {
        console.error(colors.red(`[Database] Error: ${error.message}`));
        process.exit(1);
    }
}

export default connectDB;