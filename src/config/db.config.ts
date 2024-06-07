import mongoose from "mongoose";

const connectToDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI as string);
    if (conn.connection.readyState === 1) {
      console.log(`Connected to DB - ${conn.connection.host}`);
    }
  } catch (error: any) {
    console.log(error?.message);
    process.exit(1);
  }
};

export default connectToDB;
