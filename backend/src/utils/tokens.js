import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const generateTokens = (payload) => {

    try{
        const access = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"15m"})
        const refresh = jwt.sign(payload, process.env.JWT_SECRET, {expiresIn:"1d"})

        return {access, refresh}
    }
    catch(err){
        throw new Error("Error creating session tokens", err)
    }
}
