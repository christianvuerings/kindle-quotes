import { commonConfig } from "../common/oauth-config";

const generateGetParams = (params) =>
  Object.entries(params)
    .map((kv) => kv.map(encodeURIComponent).join("="))
    .join("&");

export const generateAuthorizeUrl = ({ scope }) => {
  const params = {
    response_type: "code",
    client_id: commonConfig.clientId,
    redirect_uri: commonConfig.redirectUri,
    scope,
    state: "",
  };

  return commonConfig.authorizePath + "?" + generateGetParams(params);
};
