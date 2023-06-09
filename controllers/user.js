const { User, Role } = require('../db/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;
const oauth2 = require('../utils/oauth2');
const imagekit = require('../utils/imagekit');
const nodemailer = require('../utils/nodemailer');

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, telp, password } = req.body;

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
        isActivated: false,
        role_id: null
      };

      const userRole = await Role.findOne({ where: { name: 'User' } });
      if (userRole) {
        userData.role_id = userRole.id;
      }
      const user = await User.create(userData);

      // Mengirim email aktivasi
      const activationLink = `${req.protocol}://${req.get('host')}/auth/activate/${user.id}`;

      const html = `
        <h1>Account Activation</h1>
        <p>Hello ${user.name}</p>
        <p>Please click the following link to activate your account:</p>
        <a href="${activationLink}" style="display: inline-block; padding: 10px 20px; background-color: green; color: white; text-decoration: none;">Activate Your Account</a>
      `;

      await nodemailer.sendMail(user.email, 'Account Activation', html);

      return res.status(201).json({
        status: true,
        message: 'User created! Please Check Your Email for Activate',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          telp: user.telp,
          role_id: user.role_id
        }
      });
    } catch (error) {
      throw error;
    }
  },

  activateAccount: async (req, res) => {
    try {
      const { id } = req.params;

      const user = await User.findByPk(id);
      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'User not found!',
          data: null
        });
      }

      if (user.isActivated) {
        return res.status(400).json({
          status: false,
          message: 'Link expired, account already active!',
          data: null
        });
      }

      // Setel status akun menjadi "aktif"
      user.isActivated = true;
      await user.save();

      return res.status(200).json({
        status: true,
        message: 'Account activated successfully',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          telp: user.telp,
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
          message: 'credential is not valid!',
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
          message: 'credential is not valid!',
          data: null
        });
      }

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        telp: user.telp,
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
      return res.status(200).json({
        status: true,
        message: 'fetch user success!',
        data: req.user
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
          email: data.email,
          telp: data.telp,
          role_id: 3,
          user_type: 'google'
        });
      }

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        telp: user.telp,
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
          email: user.email,
          telp: user.telp,
          profilePicture: user.profilePicture
        }
      });
    } catch (err) {
      throw err;
    }
  }
}