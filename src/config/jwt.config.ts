export const jwtConfig = {
  test: {
    ACCESS_TOKEN: {
      secretKey: 'serrhsauioybfub',
      REFRESHABLE: {
        signOptions: {
          algorithm: 'HS256',
          expiresIn: '24h'
        }
      }
    }
  }
}; 