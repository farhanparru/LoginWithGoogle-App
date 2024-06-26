require("dotenv").config();
const  express = require('express')
const  app = express()
const cors = require("cors")
const PORT = 7000;
require('./Db/conncetion')
const session = require('express-session')
const passport = require("passport")
const OAuth25trategy = require('passport-google-oauth2').Strategy
const userDb =  require('./Model/userSchema')



const googleClientID = process.env.GOOGLE_CLIENT_ID;
const googleClientSecret = process.env.GOOGLE_CLIENT_SECRET;





app.use(cors({
    origin:"http://localhost:3000",
    methods:"GET,POST,PUT,DELETE",
    credentials:true
}))

app.use(express.json());

// steup session
app.use(session({
    secret:"15672983hakdhfjkjdsd",
    resave:false,
    saveUninitialized:true
}))


// steup Passport

app.use(passport.initialize());
app.use(passport.session());


passport.use(
    new OAuth25trategy({
        clientID:googleClientID,
        clientSecret:googleClientSecret,
        callbackURL:"/auth/google/callback",
        scope:['profile','email']
    },
    async(accessToken,refreshToken,profile,done)=>{
        
        try {
            let user = await userDb.findOne({googleId:profile.id});

            if(!user){
                 user = new userDb({
                    googleId:profile.id,
                    displayName:profile.displayName,
                    email:profile.emails[0].value,
                    image:profile.photos[0].value
                 })

                 await user.save()
            }
             return done(null, user)
        } catch (error) {
            return done(error,null)
        }
    }
)
)

passport.serializeUser((user,done)=>{
    done(null,user)
})

passport.deserializeUser((user,done)=>{
    done(null,user)
})

// initial google authtication
app.get('/auth/google',passport.authenticate('google',{scope:['profile','email']}))

app.get('/auth/google/callback',passport.authenticate("google",{
    successRedirect:"http://localhost:3000/dashboard",
    failureRedirect:"http://localhost:3000/login"
}))

app.get("/login/sucess", async(req,res)=>{
  
    if(req.user){
        res.status(200).json({message:"user Login", user:req.user})
    }else{
        res.status(400).json({message:"Not Authorized"})
    }
})       
   
app.get('/logout',(req,res,next)=>{
    req.logout(function(err){
        if(err){return next(err)}
        res.redirect("http://localhost:3000")
    })
})
    
app.listen(PORT,()=>{
    console.log(`server start at port on ${PORT}`);
})