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

export const registrationValidator = (req, res, next) => {
    const {first, last, email, password, phone} = req.body;

    //all fields required
    if(!first || !last || !email || !password || !phone){
        return res.status(400).json({message:"All fields required"})
    }

    const validation = registrationSchema.safeParse(req.body);
    if(!validation.success){
        return res.status(400).json({message:"input validation failed", errpr:validation.error})
    }

    next();
}