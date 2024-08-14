import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth2';
import { Profile } from 'passport';
import { Employee } from './entities/employee';
import { generateToken } from '../middleware/generateToken';
import { Role } from './entities/role';
import { RoleTypes } from './entities/constants/constants';

const GOOGLE_CLIENT_ID = '271432223949-pb1qjj9pv3dfne445cvk2989jk0cv7cd.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

passport.use(new GoogleStrategy({
    clientID: GOOGLE_CLIENT_ID,
    clientSecret: GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/google/callback",
    passReqToCallback: true
  },
  async (request: any, accessToken: string, refreshToken: string, profile: Profile, done: Function) => {
    console.log("Google Strategy Callback:", profile); // Debugging

    try {
      let user = await Employee.findOne({ where: { googleId: profile.id } });

      if (!user) {
        const email = profile.emails && profile.emails[0].value;
        const username = 'saifUsername'; // Set the desired username

        // Find or create the User role
        let role = await Role.findOne({ where: { role: RoleTypes.User } });

        if (!role) {
          role = Role.create({ role: RoleTypes.User });
          await Role.save(role);
        }

        // Create the new user
        user = Employee.create({
          googleId: profile.id,
          name: profile.displayName,
          email,
          role
        });

        await Employee.save(user);
      }
      else{
        console.log("Already have an Account");
      }

      const token = await generateToken({ id: user.id, name: user.name, email: user.email });

      return done(null, { ...user, token });
    } catch (err) {
      console.error("Error in Google Strategy Callback:", err);
      return done(err);
    }
  }
));

passport.serializeUser((user: any, done: Function) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: string, done: Function) => {
  try {
    const user = await Employee.findOne({ where: { id: parseInt(id, 10) } });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
