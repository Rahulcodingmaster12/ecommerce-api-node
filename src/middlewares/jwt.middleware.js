// import jwt from 'jsonwebtoken';

// const jwtAuth = (req, res, next)=>{
//     // 1. Read the token
//     const token = req.headers['authorization'];
//     console.log(token);
//     // 2. if no token, return the error.
//     console.log('token: ' + token);
//     if(!token){
//         return res.status(401).send('Unauthorized');
//     }
//     // 3. check if token is valid.
//     try{
//        const payload =  jwt.verify(
//             token,
//             'asldkfidfja'
//         );
//         console.log(payload);
//     } catch(err){
//         console.log(err);
//         // 4. return error.
//         return res.status(401).send('Unauthorized');
//     }
    
//     // 5. call next middleware
//     next();
// }

// export default jwtAuth;


import jwt from 'jsonwebtoken';

const jwtAuth = (req, res, next) => {
    // 1. Read the token from Authorization header
    const token = req.headers['authorization'];
    
    console.log('Received token:', token);

    // 2. If no token, return error.
    if (!token) {
        return res.status(401).send('Unauthorized');
    }

    // 3. Check if token is valid.
    try {
        const payload = jwt.verify(token, 'asldkfidfja');  // Ensure the secret is correct
        console.log('Decoded payload:', payload);
        req.userID = payload.userID;
    } catch (err) {
        console.log('Token verification error:', err);
        // 4. Return error if token is invalid.
        return res.status(401).send('Unauthorized');
    }

    // 5. Call next middleware
    next();
}

export default jwtAuth;