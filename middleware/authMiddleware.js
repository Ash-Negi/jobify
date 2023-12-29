import { UnauthenticatedError, UnauthorizedError, BadRequestError } from "../errors/customErrors.js"
import { verifyJWT } from "../utils/tokenUtils.js"

export const authenticateUser = (req,res,next) => {
    const {token} = req.cookies
    if(!token) throw new UnauthenticatedError('auth invalid')

    try{
        const {userID,role}= verifyJWT(token)
        const testUser = userID === '656681a9b927f4d6938114b1'
        req.user = {userID, role, testUser }
        next()
    }catch(error){
        throw new UnauthenticatedError('authentication invalid')
    }
}

export const authorizePermissions = (...roles) => {
    return (req,res,next) => {
    console.log(roles)
    if(!roles.includes(req.user.role)){
        throw new UnauthorizedError("Unauthorized to access this route")
    } // have access to req.user.role because of authenticate user middleware
    next() //passes to our route
    }
}

export const checkForTestUser = (req,res,next) => {
    if(req.user.testUser){
        throw new BadRequestError('Demo User. Read Only')
    }
    next()
}