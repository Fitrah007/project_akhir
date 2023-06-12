const { User } = require('../db/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;
const oauth2 = require('../utils/oauth2');
const imagekit = require('../utils/imagekit');
const { sendMail } = require('../utils/nodemailer');
const moment = require('moment');

const OTP_EXPIRATION_MINUTES = 5;

const generateOTP = (length) => {
  const characters = '0123456789';
  let OTP = '';
  for (let i = 0; i < length; i++) {
    OTP += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return OTP;
};

module.exports = {
  register: async (req, res) => {
    try {
      const { name, email, telp, password } = req.body;

      const exist = await User.findOne({ where: { email } });
      if (exist) {
        return res.status(400).json({
          status: false,
          message: 'Email already used!',
          data: null
        });
      }

      const hashPassword = await bcrypt.hash(password, 10);
      const userData = {
        name,
        email,
        telp,
        password: hashPassword,
        is_active: false
      };

      const user = await User.create(userData);

      // Generate OTP
      const otp = generateOTP(6);
      const otpExpiration = moment().add(OTP_EXPIRATION_MINUTES, 'minutes').toDate();
      user.otp = otp;
      user.otp_expired = otpExpiration;
      await user.save();

      // Send activation email with OTP
      const to = user.email;
      const subject = 'Activation Code';
      const html = `
        <h2>Activation Code</h2>
        <p>Your activation code is: ${otp}</p>
      `;

      await sendMail(to, subject, html);

      return res.status(201).json({
        status: true,
        message: 'User created! Please check your email to activate your account.',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          telp: user.telp
        }
      });
    } catch (error) {
      throw error;
    }
  },

  activate: async (req, res) => {
    try {
      const { email, otp } = req.body;

      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: 'User not found!',
          data: null
        });
      }

      if (user.is_active) {
        return res.status(400).json({
          status: false,
          message: 'User is already activated!',
          data: null
        });
      }

      if (user.otp !== otp) {
        return res.status(400).json({
          status: false,
          message: 'Invalid OTP!',
          data: null
        });
      }

      const now = moment();
      if (now.isAfter(user.otp_expired)) {
        return res.status(400).json({
          status: false,
          message: 'OTP has expired!',
          data: null
        });
      }

      user.is_active = true;
      await user.save();

      return res.status(200).json({
        status: true,
        message: 'User activated successfully!',
        data: null
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
        email: user.email,
        telp: user.telp
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
          email: data.email,
          telp: data.telp,
          user_type: 'google'
        });
      }

      const payload = {
        id: user.id,
        name: user.name,
        email: user.email,
        telp: user.telp
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