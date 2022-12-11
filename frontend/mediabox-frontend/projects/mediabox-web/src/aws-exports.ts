/* eslint-disable */
// WARNING: DO NOT EDIT. This file is automatically generated by AWS Amplify. It will be overwritten.
const awsconfig_dev = {
  aws_project_region: "us-east-1",
  aws_cognito_region: "us-east-1",
  aws_user_pools_id: "us-east-1_Z0IW4U3ph",
  aws_user_pools_web_client_id: "6rplfnij5lt01jm70j8vfoj5kp",
  oauth: {
    domain: "mediabox.auth.us-east-1.amazoncognito.com",
    scope: ["email", "openid", "profile"],
    redirectSignIn: "http://localhost:4200/auth/login",
    redirectSignOut: "http://localhost:4200",
    responseType: "code",
  },
  federationTarget: "COGNITO_USER_POOLS",
  cookieStorage: {
    domain: 'localhost',
    secure: false,
    path: '/',
    expires: 365,
  },
  };
  export default awsconfig_dev;
  