import { z } from "zod";

const registrationSchema = z.object({
    first: z.string(),
    last: z.string(),
    email: z.email(),
    phone: z.e164(),
    studentId: z.string().min(8).max(15),
    //password
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(32, { message: "Password cannot exceed 32 characters" })
        .refine((val) => /[A-Z]/.test(val), {
            message: "Password must contain at least one uppercase letter",
        })
        .refine((val) => /[a-z]/.test(val), {
            message: "Password must contain at least one lowercase letter",
        })
        .refine((val) => /[0-9]/.test(val), {
            message: "Password must contain at least one number",
        })
        .refine((val) => /[^A-Za-z0-9]/.test(val), {
            message: "Password must contain at least one special character",
        })
}
)

const loginSchema = z.object({
    email:z.email(),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters long" })
        .max(32, { message: "Password cannot exceed 32 characters" })
        .refine((val) => /[A-Z]/.test(val), {
            message: "Password must contain at least one uppercase letter",
        })
        .refine((val) => /[a-z]/.test(val), {
            message: "Password must contain at least one lowercase letter",
        })
        .refine((val) => /[0-9]/.test(val), {
            message: "Password must contain at least one number",
        })
        .refine((val) => /[^A-Za-z0-9]/.test(val), {
            message: "Password must contain at least one special character",
        })
})

export const loginValidator = (req, res, next) => {
    const {email, password} = req.body;

    //both fields required
    if(!email || !password){
        return res.status(400).json({message:"both fields required"})
    }

    //validate
    const validation = loginSchema.safeParse({email, password});
    if(!validation.success){
        return res.status(400).json({message:"validation failed", error:validation.error})
    }

    next();
}

export const registrationValidator = (req, res, next) => {
    const {first, last, email, password, confirm, phone} = req.body;

    //all fields required
    if(!first || !last || !email || !password || !phone || !confirm){
        return res.status(400).json({message:"All fields required"})
    }

    //password must match
    if(password !== confirm){
        return res.status(400).json({message:"password does not match"})
    }

    const validation = registrationSchema.safeParse(req.body);
    if(!validation.success){
        return res.status(400).json({message:"input validation failed", errpr:validation.error})
    }

    next();
}