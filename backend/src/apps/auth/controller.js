import Users from "../../models/user.js";
import hash from "../../utils/hash.js";
import { generateTokens } from "../../utils/tokens.js";
import bcrypt from "bcrypt";

/**
 * @description accepts first, last, email ,  password and creates user returning session tokens
 * @param {*} req 
 * @param {*} res 
 * @param {*} next 
 */

export const register = async(req, res, next) => {
    const {first, last, email, password, phone, studentId} = req.body;

    //user already exists
    try{
        const idCount = await Users.count({where:{studentId:studentId}});
         const emailCount = await Users.count({where:{email:email}});
        if(idCount !== 0 || emailCount !== 0){
            return res.status(400).json({message:"the provided student id is already present in the system, please login"});
        }

         //hash password
         const passwordHash = await hash(password);

         //create user
         const instance = await Users.create({first:first, last:last, email:email, studentId:studentId, phone:phone, passwordHash:passwordHash});

         //generate tokens
         const payload = {
            id:instance.id,
            email:instance.email,
            role:instance.role
         }
         const {access, refresh} = generateTokens(payload);

         //session cookies
           const cookieOptions = {
            secure: false,
            sameSite: 'none',
            httpOnly: true,
            path:"/"
        }

        res.cookie("access", access, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
        res.cookie("refresh", refresh, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 });

        return res.status(201).json({message:"registered successfully"})
    }
    catch(err){
        next(err)
    }
}

/**
 * @description accepts email, password and return session cookies
 */
export const login = async(req, res, next) => {
    const {email, password} = req.body;

    try{
    //get user
    const user = await Users.findOne({where:{email:email}});

    if(!user){
        return res.status(404).json({message:"User not found"})
    }

    //verify password
    const hashedPassword = user.passwordHash;

    const passwordMatch = await bcrypt.compare(password, hashedPassword)
    if(!passwordMatch){
        return res.status(404).json({message:"incorrect password"})
    }

    //generate tokens
    const payload = {
        id:user.id, 
        email:user.email,
        role:user.role
    }
    const {access, refresh} = generateTokens(payload)

    //set cookies
           const cookieOptions = {
            secure: false,
            sameSite: 'none',
            httpOnly: true,
            path:"/"
        }

        res.cookie("access", access, { ...cookieOptions, maxAge: 15 * 60 * 1000 });
        res.cookie("refresh", refresh, { ...cookieOptions, maxAge: 24 * 60 * 60 * 1000 });

        //return
        return res.status(200).json({message:"Login success", data:{first:user.first, email:user.email, role:user.role}})
    }
    catch (err) {
        next(err)
    }
}