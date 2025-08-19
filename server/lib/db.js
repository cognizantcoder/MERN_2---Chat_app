import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    mongoose.connection.on("connected", () =>
      console.log("MongoDB connection successful")
    );
    await mongoose.connect(`${process.env.MONGODB_URI}/chat_app` );
  } catch (error) {
    console.log(error);
  }
};
