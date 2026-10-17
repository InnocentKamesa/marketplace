import jwt from "jsonwebtoken";

export  const authenticate = (req, res, next) => {
    const accessToken = req.cookies.access;

    if(!accessToken){
        return res.status(401).json({message:"Access token not found"})
    }

    try{
        const decoded = jwt.verify(accessToken, process.env.JWT_SECRET);
        req.user = decoded;
        next();
    }
    catch(err){
        return res.status(401).json({message:"Invalid access token"})
    }
}