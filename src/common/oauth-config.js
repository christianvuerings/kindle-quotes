const oauthApi = "https://github.com/login/oauth";
const siteUrl = process.env.NETLIFY_URL || "http://localhost:8888";

console.log("siteUrl", siteUrl);
console.log("process.env", process.env);

export const commonConfig = {
  clientId: process.env.REACT_APP_CLIENT_ID,
  tokenHost: oauthApi,
  authorizePath: `${oauthApi}/authorize`,
  tokenPath: `${oauthApi}/access_token`,
  redirectUri: `${siteUrl}/.netlify/functions/auth-callback`,
};

if (!commonConfig.clientId) {
  throw new Error("MISSING REQUIRED ENV VARS. Please set CLIENT_ID");
}
