const passport = require("passport");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.use(
	new GoogleStrategy(
		{
			clientID: process.env.GOOGLE_AUTH_CLIENT_ID,
			clientSecret: process.env.GOOGLE_AUTH_CLIENT_SECRET,
			callbackURL: "/auth/google/callback",
		},
		function (accessToken, refreshToken, profile, done) {
			done(null, profile);
			//if mongoDB
			/* 
            don stuer ={
                usname: profile.dipslyaname
                avart: profile.phots[0]

                User.save
            } */
		}
	)
);

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});
