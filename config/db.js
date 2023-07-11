import mongoose from "mongoose";

export const conectarDB = async() => {
    try {
        const db = await mongoose.connect(
            process.env.MONGO_URI, 
            {
                // 2 Lineas requeridad por mongoose
                useNewUrlParser: true,
                useUnifiedTopology: true
            }
        );

        const url = `${db.connection.host}:${db.connection.port}`;
        console.log(`MongoDB conectado en: ${url}`);
    } catch (error) {
        console.log(`Error: ${error.message}`);
        process.exit(1);
    }
}