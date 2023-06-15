const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;
const blacklist = [];

const isTokenExpired = (exp) => {
  const currentTime = Math.floor(Date.now() / 1000);
  return exp < currentTime;
};

module.exports = {
  auth: async (req, res, next) => {
    try {
      const { authorization } = req.headers;

      console.log('TOKEN :', authorization);
      if (!authorization) {
        return res.status(401).json({
          status: false,
          message: 'you\'re not authorized!',
          data: null
        });
      }

      const token = authorization.split(' ')[1];

      if (blacklist.includes(token)) {
        return res.status(401).json({
          status: false,
          message: 'Token has been revoked!',
          data: null
        });
      }

      const data = await jwt.verify(authorization, JWT_SECRET_KEY);

      if (isTokenExpired(data.exp)) {
        return res.status(401).json({
          status: false,
          message: 'Token has expired!',
          data: null
        });
      }

      req.user = {
        id: data.id,
        name: data.name,
        email: data.email,
        telp: data.telp,
        user_type: data.user_type,
        isActivated: data.isActivated,
        profilePicture: data.profilePicture
      };

      next();
    } catch (err) {
      next(err);
    }
  }
};