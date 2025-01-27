import jwt = require('jsonwebtoken');
import { jwtConfig } from '../../config/jwt.config';

//const env = process.env.NODE_ENV.toLowerCase();
const env = 'test'.toLowerCase();

export class Jwt {
  signer(tokenValues: any, expiresIn = null) {
    if (!expiresIn) {
      expiresIn = jwtConfig[env].ACCESS_TOKEN.REFRESHABLE.signOptions.expiresIn;
    }
    const token = jwt.sign(tokenValues, jwtConfig[env].ACCESS_TOKEN.secretKey, {
      algorithm: jwtConfig[env].ACCESS_TOKEN.REFRESHABLE.signOptions.algorithm,
      expiresIn,
    });
    return token;
  }
  verifier(token) {
    try {
      const tokenValues = jwt.verify(
        token,
        jwtConfig[env].ACCESS_TOKEN.secretKey,
      );
      return tokenValues;
    } catch (e) {
      return false;
    }
  }
}
