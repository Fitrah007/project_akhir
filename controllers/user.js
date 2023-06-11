const { User, Role } = require('../db/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;
const oauth2 = require('../utils/oauth2');
const imagekit = require('../utils/imagekit');

module.exports = {
  register: async (req, res) => {
    try {
      const { name, telp, email, password } = req.body;

      const exist = await User.findOne({ where: { email } });
      if (exist) {
        return res.status(400).json({
          status: false,
          message: 'email already used!',
          data: null
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const userData = {
        name,
        telp,
        email,
        password: hashPassword,
        is_active: true
      };

      const userRole = await Role.findOne({ where: { name: 'User' } });
      if (userRole) {
        userData.role_id = userRole.id;
      }
      const user = await User.create(userData);

      // Mengirim email aktivasi menggunkan otp


      return res.status(201).json({
        status: true,
        message: 'User created! Please Check Your Email for Activate',
        data: {
          id: user.id,
          name: user.name,
          telp: user.telp,
          email: user.email,
          role_id: user.role_id
        }
      });
    } catch (error) {
      throw error;
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: 'Invalid email or password!',
          data: null
        });
      }

      if (!user.isActivated) {
        return res.status(400).json({
          status: false,
          message: 'Your account is not activated!',
          data: null
        });
      }

      if (user.user_type == 'google' && !user.password) {
        return res.status(400).json({
          status: false,
          message: 'your accont is registered with google oauth, you need to login with google oauth2!',
          data: null
        });
      }

      const passwordCorrect = await bcrypt.compare(password, user.password);

      if (!passwordCorrect) {
        return res.status(400).json({
          status: false,
          message: 'Invalid email or password!',
          data: null
        });
      }

      const payload = {
        id: user.id,
        name: user.name,
        telp: user.telp,
        email: user.email,
        role_id: user.role_id
      };

      const token = await jwt.sign(payload, JWT_SECRET_KEY);
      return res.status(200).json({
        status: true,
        message: 'login success!',
        data: {
          token: token
        }
      });

    } catch (error) {
      throw error;
    }
  },

  whoami: async (req, res) => {
    try {
      const { id } = req.user; // ID user yang sudah login

      const user = await User.findByPk(id, {
        attributes: ['name', 'nama_keluarga', 'telp', 'email']
      });

      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'Anda harus login terlebih dahulu!',
          data: null
        });
      }

      return res.status(200).json({
        status: true,
        message: 'Fetch user success!',
        data: user
      });
    } catch (error) {
      throw error;
    }
  },

  googleOauth2: async (req, res) => {
    try {
      const { code } = req.query;
      if (!code) {
        const googleLoginUrl = oauth2.generateAuthUrl();
        return res.redirect(googleLoginUrl);
      }

      await oauth2.setCreadentials(code);
      const { data } = await oauth2.getUserData();


      let user = await User.findOne({ where: { email: data.email } });
      if (!user) {
        user = await User.create({
          name: data.name,
          telp: data.telp,
          email: data.email,
          role_id: 3,
          user_type: 'google'
        });
      }

      const payload = {
        id: user.id,
        name: user.name,
        telp: user.telp,
        email: user.email,
        role_id: user.role_id
      };

      const token = await jwt.sign(payload, JWT_SECRET_KEY);
      return res.status(200).json({
        status: true,
        message: 'login success!',
        data: {
          token: token
        }
      });
    } catch (error) {
      throw error;
    }
  },

  show: async (req, res) => {
    try {
      const user = await User.findAll();

      return res.status(200).json({
        status: true,
        message: 'success',
        data: user
      });
    } catch (error) {
      throw error;
    }
  },

  uploadProfile: async (req, res) => {
    try {
      const { id } = req.user;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'User not found!',
          data: null
        });
      }

      const stringFile = req.file.buffer.toString('base64');

      const uploadFile = await imagekit.upload({
        fileName: req.file.originalname,
        file: stringFile
      });

      // Memperbarui gambar profil pengguna
      user.profilePicture = uploadFile.url;
      await user.save();

      return res.json({
        status: true,
        message: 'Profile picture uploaded successfully',
        data: {
          id: user.id,
          name: user.name,
          telp: user.telp,
          email: user.email,
          profilePicture: user.profilePicture
        }
      });
    } catch (err) {
      throw err;
    }
  }
}