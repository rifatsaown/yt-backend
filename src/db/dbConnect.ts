import mongoose from 'mongoose';

const connectDB = async()=> {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGO_URI}/${process.env.DB_NAME}`)
        console.log(`MongoDB Connected: ${connectionInstance.connection.host}`)
    } catch (error : any) {
        console.error(`Error: ${error.message}`)
        process.exit(1)
    }
}

export default connectDB;