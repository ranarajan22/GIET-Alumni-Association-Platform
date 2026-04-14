const { signupAlumni, loginAlumni, changePasswordFirstLogin } = require('../Controllers/AuthAlumniController');
const { signupAlumniValidation, loginAlumniValidation } = require('../Middlewares/AuthAlumniValidation');
const router = require('express').Router();
const upload = require('../Middlewares/multer');
const protectRoute = require('../Middlewares/ProtectRoute');

// Routes for Alumni authentication
router.post('/signup', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'degreeCertificateImage', maxCount: 1 }]), signupAlumniValidation, signupAlumni);
router.post('/login', loginAlumniValidation, loginAlumni);
router.put('/change-password-first-login', protectRoute, changePasswordFirstLogin);

module.exports = router;
