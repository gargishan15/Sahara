import jwt from 'jsonwebtoken';

const authAdmin = (req, res, next) => {
  try {
  
    console.log('Incoming headers:', req.headers);

    const { atoken } = req.headers;
    console.log('Extracted atoken:', atoken);

    if (!atoken) {
      return res.json({ success: false, message: "Not Authorized, login again!" });
    }

   
    let token_decode;
    try {
      token_decode = jwt.verify(atoken, process.env.JWT_SECRET);
    } catch (err) {
      console.error('JWT verification error:', err.message);
      return res.json({ success: false, message: err.message });
    }

    console.log('Decoded token:', token_decode);

    if (token_decode.email !== process.env.ADMIN_EMAIL) {
      return res.json({ success: false, message: "Not Authorized, login again!" });
    }

    next();
  } catch (error) {
    console.error('authAdmin middleware error:', error);
    return res.json({ success: false, message: error.message });
  }
};

export default authAdmin;
