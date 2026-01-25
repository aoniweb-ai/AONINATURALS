import jwt from "jsonwebtoken"

export const createJSONToken = (res,value,role=null)=>{
    const token = jwt.sign({value},(role ? process.env.ADMIN_SECRET_KEY : process.env.SECRET_KEY),{expiresIn:'7d'})
    res.cookie((role ? "jwtAdmin": "jwt"),token,{
        maxAge:86400000*7, // 7 days
        httpOnly:true,
        secure:process.env.PRODUCTION!='DEVELOPMENT',
        sameSite:'none',
        path:"/"
    })
}