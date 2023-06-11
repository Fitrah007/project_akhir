const express = require('express');
const router = express.Router();
const user = require('../controllers/user');
const rbac = require('../controllers/rbac');
const bandara = require('../controllers/bandara');
const booking = require('../controllers/booking');

const enums = require('../utils/enum');
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
router.post('/auth/login', user.login);
router.get('/auth/whoami', middlewares.auth, user.whoami);
router.get('/auth/oauth', user.googleOauth2);
router.get('/auth/show', middlewares.auth, middlewares.rbac(enums.rbacModule.authorization, true, false, false, false), user.show);

//TODO: Booking
router.post('/penerbangan/booking', middlewares.auth, booking.pesanTiket);

//TODO: Penerbangan
router.get('/penerbangan/all', middlewares.auth, middlewares.rbac(enums.rbacModule.authorization, true, false, false, false), booking.getPenerbangan);


router.post('/auth/bandara', bandara.create);
router.get('/auth/bandara', bandara.getAll);
router.get('/auth/bandara/:id_bandara', bandara.getOne);


//* Upload Avatar for user
// bisa digunakan untuk upload profile atau update profile, tinggal memasukan gambar baru saja
router.post('/auth/upload-profile', middlewares.auth, multer.single('profilePicture'), user.uploadProfile);


// module
router.post('/rbac/modules', middlewares.auth, middlewares.rbac(enums.rbacModule.authorization, true, true, false, false), rbac.modules.store);
router.get('/rbac/modules', middlewares.auth, middlewares.rbac(enums.rbacModule.authorization, true, false, false, false), rbac.modules.index);
router.get('/rbac/modules/:id', middlewares.auth, middlewares.rbac(enums.rbacModule.authorization, true, false, false, false), rbac.modules.show);
router.put('/rbac/modules/:id', middlewares.auth, middlewares.rbac(enums.rbacModule.authorization, true, false, true, false), rbac.modules.update);
router.delete('/rbac/modules/:id', middlewares.auth, middlewares.rbac(enums.rbacModule.authorization, true, false, false, true), rbac.modules.destroy);

// role
router.post('/rbac/roles', middlewares.auth, middlewares.rbac(enums.rbacModule.authorization, true, true, false, false), rbac.roles.store);
router.get('/rbac/roles', middlewares.auth, middlewares.rbac(enums.rbacModule.authorization, true, false, false, false), rbac.roles.index);
router.get('/rbac/roles/:id', middlewares.auth, middlewares.rbac(enums.rbacModule.authorization, true, false, false, false), rbac.roles.show);
router.put('/rbac/roles/:id', middlewares.auth, middlewares.rbac(enums.rbacModule.authorization, true, false, true, false), rbac.roles.update);
router.delete('/rbac/roles/:id', middlewares.auth, middlewares.rbac(enums.rbacModule.authorization, true, false, false, true), rbac.roles.destroy);

// role access
router.post('/rbac/roleaccess', middlewares.auth, middlewares.rbac(enums.rbacModule.authorization, true, true, false, false), rbac.roleaccess.store);
router.get('/rbac/roleaccess', middlewares.auth, middlewares.rbac(enums.rbacModule.authorization, true, false, false, false), rbac.roleaccess.index);
router.get('/rbac/roleaccess/:id', middlewares.auth, middlewares.rbac(enums.rbacModule.authorization, true, false, false, false), rbac.roleaccess.show);

module.exports = router;