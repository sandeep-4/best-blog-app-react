const passport = require("passport");
const User = require("../models/user");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const LocalStrategy = require("passport-local");

const secret = process.env.JWT_SECRET;

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader("authorization"),
  secretOrKey: secret,
};

const jwtLogin = new JwtStrategy(jwtOptions, async (payload, done) => {
  await User.findById(payload.sub, async (err, user) => {
    if (err) {
      return done(err, false);
    }
    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

const localOptions = { usernameField: "email" };

const localLogin = new LocalStrategy(
  localOptions,
  async (email, password, done) => {
    await User.findOne({ email }).exec((err, user) => {
      if (err) {
        return done(err);
      }

      if (!user) {
        return done(null, false, { message: "Invalid credintials" });
      }
      user.comparePassword(password, async (err, isMatch) => {
        if (err) {
          return done(err);
        }
        if (!isMatch) {
          return done(null, false, { message: "Invalid credintials" });
        }
        return done(null, user);
      });
    });
  }
);

passport.use(jwtLogin);
passport.use(localLogin);
