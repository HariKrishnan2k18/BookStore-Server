import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.SECRET_KEY;

const verifyJWT = (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    if (!token) {
      return res.status(401).json({ message: 'Authorization token is missing' });
    }
  
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
          console.log({err, token})
        return res.status(403).json({ message: 'Invalid or expired token' });
      }
      req.user = decoded;
      
      next();
    });
  };
  
  export default verifyJWT;