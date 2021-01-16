const { AuthenticationError } = require("apollo-server");

const jwt = require("jsonwebtoken")
const {SECRET_KEY} = require("../config");

module.exports = ({req:{headers:{authorization}}}) => {
    // context = {...headers}
    const authHeader = authorization;
    if (authHeader){
        // Bearer ...
        const token = authHeader.split('Bearer ')[1];
        
        // verifies the token 
        if (token){
            try{
                const user = jwt.verify(token, SECRET_KEY);
                return user;
            } catch (err) {
                throw new AuthenticationError("Invalid/expired token");
            }
        }
        throw new Error("Authentication token must be \'Bearer [token]\'");
    }
    throw new Error("Authorization header must be provided");
}