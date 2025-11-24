import mongoose from 'mongoose';
const connectDb=async()=>{
    try{
     const conn=await mongoose.connect(process.env.mongoUri, {
      dbName: "chatting_app",
    });
     console.log("✅ Database connected successfully:", conn.connection.host);
    }
    catch(error){
      console.log("database fails",error.message);
    }

}
export default connectDb;