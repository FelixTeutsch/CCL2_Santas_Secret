const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');

router.all('/', userController.viewProfile);

router.route('/edit').get(userController.edit).post(userController.updateProfile);
router.route('/delete').post(userController.deleteProfile);
router.route('/picture').get(userController.changePictrue).post(userController.updatePicture);
// router.route('/password').get(userController.changePassword).post(userController.updatePassword);
// The rendered profile is not of the user himself, but if he is viewing someone elses profile
router.all('/view/:id', userController.viewProfile);

module.exports = router;
