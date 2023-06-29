const { User } = require('../db/models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { JWT_SECRET_KEY } = process.env;
const oauth2 = require('../utils/oauth2');
const imagekit = require('../utils/imagekit');
const { sendMail, getHtml } = require('../utils/nodemailer');
const nodemailer = require('../utils/nodemailer');
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

      const payload = {
        email: email,
        otp: otp
      };

      const token = await jwt.sign(payload, JWT_SECRET_KEY);

    // Mengirim email aktivasi
    const activationLink = `${req.protocol}://${req.get('host')}/activate?token=${token}`;

     // Send activation email with OTP
     const to = email;
     const subject = 'Activation Link';
     const html = `
       <h2>Activation Link</h2>
       </br>
       <a href="${activationLink}" style="display: inline-block; padding: 10px 20px; background-color: green; color: white; text-decoration: none;">Click Here to Activate Your Account</a>
        
       `;

      await sendMail(to, subject, html);

      return res.status(201).json({
        status: true,
        message: 'User created! Please check your email to activate your account.',
        data: {
          id: user.id,
          name: user.name,
          email: user.email,
          telp: user.telp,
          otp: user.otp,
          expirate: user.otp_expired
        }
      });
    } catch (error) {
      throw error;
    }
  },

  activate: async (req, res) => {
    try {
      const { token } = req.query;

      const data = await jwt.verify(token, JWT_SECRET_KEY);

      const user = await User.findOne({ where: {  email: data.email } });
      if (!user) {
        return res.status(400).json({
          status: false,
          message: 'User not found!',
          data: null
        });
      }

      if (!user.isActivated) {
        if (user.otp != data.otp) {
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
  
  
        await User.update({ isActivated: true }, { where: { email:data.email } });
  
      }
      
      return res.redirect("https://final-project-mocha-zeta.vercel.app/otp");
    } catch (error) {
      throw error;
    }
  },

  resendOtp: async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        status: false,
        message: "Email not found",
        data: null,
      });
    }

    const waitingPeriodMinutes = 3; // Set the waiting period in minutes
    const waitingPeriodMillis = waitingPeriodMinutes * 60 * 1000; // Convert to milliseconds

    const otpRecord = await User.findOne({ where: { email } });

    if (otpRecord) {
      const lastSentAt = otpRecord.updatedAt;
      const currentTime = new Date();
      const elapsedTime = currentTime - lastSentAt;

      if (elapsedTime < waitingPeriodMillis) {
        const remainingTime = waitingPeriodMillis - elapsedTime;
        const remainingTimeMinutes = Math.ceil(remainingTime / (60 * 1000));

        return res.status(429).json({
          status: false,
          message: `Please wait ${remainingTimeMinutes} minutes before resending the OTP.`,
          data: null,
        });
      }
    }

    const otp = generateOTP(6);
      const otpExpiration = moment().add(OTP_EXPIRATION_MINUTES, 'minutes').toDate();
      user.otp = otp;
      user.otp_expired = otpExpiration;
      await user.save();

      const payload = {
        email: email,
        otp: otp
      };

      const token = await jwt.sign(payload, JWT_SECRET_KEY);

    // Mengirim email aktivasi
    const activationLink = `${req.protocol}://${req.get('host')}/activate?token=${token}`;

    // Send activation email with OTP
    const to = email;
    const subject = 'Activation Code';
    const html = `
      <h2>Activation Link</h2>
      </br>
      <a href="${activationLink}" style="display: inline-block; padding: 10px 20px; background-color: green; color: white; text-decoration: none;">Click Here to Activate Your Account</a>
    `;

     await sendMail(to, subject, html);

    return res.status(200).json({
      status: true,
      message: "OTP verification has been resent!",
      data: null,
    });
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
        attributes: ['name', 'telp', 'email']
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

  updateUser: async (req, res) => {
    try {
      const { id } = req.user;
      const { name, email, telp } = req.body;

      const user = await User.findByPk(id);

      if (!user) {
        return res.status(404).json({
          status: false,
          message: 'User not found!',
          data: null
        });
      }

      // Update user data
      user.name = name || user.name;
      user.email = email || user.email;
      user.telp = telp || user.telp;

      await user.save();

      return res.status(200).json({
        status: true,
        message: 'User data updated successfully!',
        data: {
          name: user.name,
          email: user.email,
          telp: user.telp
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
  },
  forgotPassword: async (req, res) => {
    const { email } = req.body;


    const user = await User.findOne({ where: { email } });

    if (user) {
      const payload = {
        id: user.id
      };

      const token = await jwt.sign(payload, JWT_SECRET_KEY);
      const url = `${req.protocol}://${req.get('host')}/reset-password?token=${token}`;

      const html = await getHtml('resetpassword.ejs', { name: user.name, url });
      await sendMail(user.email, 'Reset password request', html);
    }

    return res.status(200).json({
      status: true,
      message: 'we will send a email if the email is registered!',
      data: null
    });
  },

  resetPasswordPage: (req, res) => {
    const { token } = req.query;
    return res.redirect("https://final-project-mocha-zeta.vercel.app/reset-pass", { message: null, token });
  },

  resetPassword: async (req, res) => {
    try {
      const { password, confirm_new_password } = req.body;

      const { token } = req.query;
      if (!token) {
        return res.render('auth/reset-password', { message: 'invalid token!', token });
      }
      if (password != confirm_new_password) {
        return res.render('auth/reset-password', { message: 'confirm password does not match!', token });
      }
      console.log(confirm_new_password)
      const data = await jwt.verify(token, JWT_SECRET_KEY);

      const hashPassword = await bcrypt.hash(password, 10);
      const updated = await User.update({ password: hashPassword }, { where: { id: data.id } });
      if (updated[0] == 0) {
        return res.render('auth/reset-password', { message: `reset password failed!`, token });
      }

      return res.send('success');
    } catch (err) {
      throw err;
    }
  }
}