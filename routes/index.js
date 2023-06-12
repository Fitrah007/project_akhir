const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const bandara = require('../controllers/bandara');
const booking = require('../controllers/booking');
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

//TODO: Booking
router.post('/penerbangan/booking', middlewares.auth, booking.pesanTiket);

//TODO: Penerbangan
router.get('/penerbangan/all', middlewares.auth, booking.getPenerbangan);

router.post('/auth/bandara', bandara.create);
router.get('/auth/bandara', bandara.getAll);
router.get('/auth/bandara/:id_bandara', bandara.getOne);


//* Upload Avatar for user
// bisa digunakan untuk upload profile atau update profile, tinggal memasukan gambar baru saja
router.post('/auth/upload-profile', middlewares.auth, multer.single('profilePicture'), user.uploadProfile);

module.exports = router;