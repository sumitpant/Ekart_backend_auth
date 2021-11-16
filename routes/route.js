const router = require('express').Router();
const { login, signup ,updateDetails,refresh ,verifyToken} = require('../controllers/controller');
const { check } = require('express-validator');



router.post('/',login);

router.post('/sign-up',[
    check('name').isLength({ min: 3 }).trim().escape(),
    check('mobile').isNumeric().trim().escape()
]
,signup);

router.post('/refresh',refresh);

router.patch('/update',updateDetails);

router.post('/verify',verifyToken)

module.exports = router;