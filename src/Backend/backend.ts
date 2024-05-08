import { notification } from "antd";

export function setBackendSetting(setting: BackendSetting) {
  localStorage.setItem("ip", setting.ip);
  localStorage.setItem("port", setting.port);
  localStorage.setItem("token", setting.token);
  localStorage.setItem("protocols", setting.protocols);
}

export function getBackendSetting(): BackendSetting {
  const ip = localStorage.getItem("ip") || "";
  const port = localStorage.getItem("port") || "";
  const token = localStorage.getItem("token") || "";
  const protocols =
    (localStorage.getItem("protocols") as Protocols) || "http://";
  return { ip, port, token, protocols };
}

export function hasBackendSetting(): boolean {
  const { ip, port, token } = getBackendSetting();
  return ip !== "" && port !== "" && token !== "";
}

export function formatUrl(
  ip: string,
  port: number | string,
  protocols: Protocols
) {
  return `${protocols}${ip}:${port}`;
}

export function getBackendUrl() {
  const { protocols, ip, port } = getBackendSetting();
  return formatUrl(ip, port, protocols);
}

export function checkBackendSetting(): void {
  if (!hasBackendSetting()) {
    notification.error({
      message: "Error",
      description: "请到设置页面检查后端配置是否正确",
    });
  }
}
