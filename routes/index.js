const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const airports = require('../controllers/airport');
const booking = require('../controllers/booking');
const flights = require('../controllers/flights');

const multer = require('multer')();
const middlewares = require('../utils/middlewares');

router.get('/', (req, res, next) => {
  res.status(200)
    .json({
      message: "Welcome at Home Page!!"
    });
});

//TODO: User
router.post('/auth/register', user.register);
router.post('/activate', user.activate);
router.post('/auth/login', user.login);
router.get('/auth/whoami', middlewares.auth, user.whoami);
router.get('/auth/oauth', user.googleOauth2);

//cuma buat testing aja
router.get('/auth/show', middlewares.auth, user.show);
router.get('/ticket', booking.showTicket);
router.get('/flight', flights.show);

//TODO: Booking
router.post('/penerbangan/booking', middlewares.auth, booking.orderTicket);


//TODO: Penerbangan
router.post('/flight/search/oneway', flights.oneWay);


//TODO: Bandara
router.post('/auth/airports', airports.create);
router.get('/auth/airports', airports.getAll);
router.get('/auth/airports/:id_bandara', airports.getOne);


//* Upload Avatar for user
// bisa digunakan untuk upload profile atau update profile, tinggal memasukan gambar baru saja
router.post('/auth/upload-profile', middlewares.auth, multer.single('profilePicture'), user.uploadProfile);

module.exports = router;