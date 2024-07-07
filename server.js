import express from 'express';
import connectMongoDB from './db.js';
import authRoute from './routes/authRoute.js'
import cookieParser from 'cookie-parser';
import session from 'express-session';
import flash from 'connect-flash';

const app = express();
const PORT = process.env.PORT || 3000;

// db connection
connectMongoDB();

//middlewares
app.use(express.json());
app.use(express.urlencoded({extended: false}));

//cookie middleware
app.use(cookieParser(process.env.COOKIE));

//session middleware
app.use(session({
    secret: process.env.SESSION,
    resave: false,
    saveUninitialized: false,
    cookie: {
        maxAge: 60000*60*24*7 // 1 week cookie expiration
    }
}));

// flash messages middleware
app.use(flash());

// store flash messages for views
app.use(function (req, res, next){
    res.locals.message = req.flash();
    next();
});

// set template engine to ejs
app.set('view engine', 'ejs');

//route
app.use('/', authRoute);

app.listen(PORT, ()=>{
    console.log(`server is running on http://localhost:${PORT}`);
})