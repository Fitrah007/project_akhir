const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const airports = require('../controllers/airport');
const ticket = require('../controllers/ticket');
const flights = require('../controllers/flights');
const airplane = require('../controllers/airplane');

const multer = require('multer')();
const middlewares = require('../utils/middlewares');

router.get('/', (req, res, next) => {
  res.status(200)
    .json({
      message: "Welcome at Home Page!!"
    });
});

//cuma buat testing aja
router.get('/auth/show', middlewares.auth, user.show);
router.get('/ticket', ticket.showTicket);
router.get('/transaction', ticket.showTransaction);

//TODO: User
router.post('/auth/register', user.register);
router.get('/activate', user.activate);
router.post('/resend-otp', user.resendOtp);
router.post('/auth/login', user.login);
router.get('/auth/whoami', middlewares.auth, user.whoami);
router.put('/auth/user', middlewares.auth, user.updateUser);
router.get('/auth/oauth', user.googleOauth2);

router.get('/reset-password', user.resetPasswordPage);
router.post('/auth/forgot-password', user.forgotPassword);
router.post('/auth/reset-password', user.resetPassword);

//TODO: Upload Avatar for user
router.post('/auth/upload-profile', middlewares.auth, multer.single('profilePicture'), user.uploadProfile);

//TODO: Booking and Checkout
router.post('/flight/booking', middlewares.auth, ticket.orderTicket);
router.post('/flight/booking/checkout', middlewares.auth, ticket.checkoutTicket);

//TODO: Penerbangan
router.get('/flight', flights.show);
router.post('/flight/search/oneway', flights.oneWay);
router.post('/flight/search/twoway', flights.twoWay);

//TODO: Bandara
router.get('/airports', airports.getAll);
router.get('/airports/:airport_id', airports.getOne);

//TODO: Pesawat
router.get('/airplanes', airplane.getAll);
router.get('/airplanes/:airplane_id', airplane.getOne);

module.exports = router;