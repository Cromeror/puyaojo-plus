import deserializeUser from './deserializeUser';
import google from './google';
import facebook from './facebook';
import local from './local';

export { deserializeUser, local, google, facebook };

export default {
  deserializeUser,
  google,
  facebook,
  local
};
