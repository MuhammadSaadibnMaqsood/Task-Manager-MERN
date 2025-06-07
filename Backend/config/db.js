import mongoose from "mongoose";

export const DBconnect = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/TaskManager`)
            .then(()=>console.log("DATABASE is connected")
            );

    }
    catch (error) {

        console.log(error.message);


    }

}