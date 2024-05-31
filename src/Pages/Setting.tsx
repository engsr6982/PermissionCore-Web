import React from "react";
import {
  formatUrl,
  getBackendSetting,
  setBackendSetting,
} from "../Backend/backend";
import { Button, Input, Select, Space, Typography, notification } from "antd";
import axios from "axios";
import Password from "antd/es/input/Password";

async function validateSetting(setting: BackendSetting) {
  try {
    const response = await axios.get(
      `${formatUrl(setting.ip, setting.port, setting.protocols)}/api/validate`,
      {
        headers: {
          Authorization: `Bearer ${setting.token}`,
        },
      }
    );
    return response.status;
  } catch (error) {
    notification.error({
      message: "Error",
      description: `${error}`,
    });
    return -1;
  }
}

const Setting = () => {
  const [isValidate, setIsValidate] = React.useState(false);
  const [currentSetting, setCurrentSetting] = React.useState(
    getBackendSetting()
  );

  const handleValidation = async () => {
    const status = await validateSetting(currentSetting);
    if (status === 200) {
      setIsValidate(status === 200 ? true : false);
      notification.success({
        message: "Success",
        description: `状态码: ${status}`,
      });
    } else {
      notification.error({
        message: "Error",
        description: `状态码: ${status}`,
      });
    }
  };

  const handleSave = async () => {
    const status = await validateSetting(currentSetting);
    if (status === 200) {
      setIsValidate(status === 200 ? true : false);
      setBackendSetting(currentSetting); // save
      notification.success({
        message: "Success",
        description: `保存成功！`,
      });
    } else {
      notification.error({
        message: "Error",
        description: `状态码: ${status}`,
      });
    }
  };

  return (
    <>
      <h1 style={{ margin: "0px" }}>设置</h1>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <Space direction="vertical" size="large">
          <Typography.Text>
            IP地址:
            <Input
              addonBefore={
                <Select
                  defaultValue="http://"
                  onChange={(v) => {
                    setCurrentSetting({
                      ...currentSetting,
                      protocols: v as Protocols,
                    });
                  }}
                  options={[
                    {
                      label: "http://",
                      value: "http://",
                    },
                    {
                      label: "https://",
                      value: "https://",
                    },
                  ]}
                />
              }
              value={currentSetting.ip}
              onChange={(e) =>
                setCurrentSetting({ ...currentSetting, ip: e.target.value })
              }
            />
          </Typography.Text>
          <Typography.Text>
            端口:
            <Input
              value={currentSetting.port}
              onChange={(e) =>
                setCurrentSetting({ ...currentSetting, port: e.target.value })
              }
            />
          </Typography.Text>
          <Typography.Text>
            Token:
            <Password
              value={currentSetting.token}
              onChange={(e) =>
                setCurrentSetting({ ...currentSetting, token: e.target.value })
              }
            />
          </Typography.Text>
          <Space>
            <Button onClick={handleValidation}>验证</Button>
            <Button onClick={handleSave}>验证并保存</Button>
          </Space>
        </Space>
      </div>
    </>
  );
};

export default Setting;
