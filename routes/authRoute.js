import express from 'express';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

//default route
router.get('/', (req, res) => {
    res.render('login', {title: 'Login'});
});

router.get('/sample', (req, res) => {
    res.render('sample', {title: 'Sample'});
});

router.get('/index', (req, res) => {
    res.render('index', {title: 'KOKA POS'});
});

router.get('/login', (req, res) => {
    res.render('login', {title: 'Login'});
});

router.get('/signup', (req, res) => {
    res.render('signup', {title: 'Registration'});
});

router.get('/resetPassword', (req, res) => {
    res.render('resetPassword', {title: 'Reset Password'});
});

router.get('/backOffice', (req, res) => {
    res.render('backOffice', {title: 'Login'});
});

router.get('/settings', (req, res) => {
    res.render('settings', {title: 'Settings'});
});

// handle user registration
router.post('/signup', async (req, res) => {
    const { businessName, email, password, confirmPassword} = req.body; 
    try {
        const isUserExist = await User.findOne({ email });
        if(isUserExist) {
            req.flash('error', 'a user already exists with this email!');
            return res.redirect('/signup');
        } 
        if(password !== confirmPassword){
            req.flash('error', 'password does not match');
            return res.redirect('/signup');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            businessName,
            email,
            password: hashedPassword,
        });
        user.save();
        req.flash('success', 'registered succesfully, you can login now.');
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        req.flash('error', 'Something went wrong.');
        res.redirect('/signup');
    }
});

//handle user login
router.post('/login', async(req, res) => {
    const { email, password} = req.body;
    try {
        const user = await User.findOne({email});
        if (user && (await bcrypt.compare(password, user.password))){
            req.session.user = user;
            res.redirect('/index');
        } else {
            req.flash('error', 'invalid email or password');
            res.redirect('/login');
        }
    } catch (error) {
        console.error(error);
        req.flash('error', 'Something went wrong.');
        res.redirect('/login');
    }
});

export default router;