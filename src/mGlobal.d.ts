type Protocols = "http" | "https";

type BackendSetting = {
  ip: string;
  port: string;
  token: string;
  protocols: Protocols;
};
