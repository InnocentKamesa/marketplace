import bcrypt from "bcryptjs";

export default async function hash(val) {
    const saltRounds = 12;

    const hash = await bcrypt.hash(val, saltRounds)
    return hash;
}
