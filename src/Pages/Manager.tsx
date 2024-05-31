import { getBackendSetting, getBackendUrl } from "../Backend/backend";
import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  Select,
  Button,
  Form,
  List,
  Table,
  Modal,
  message,
  Row,
  Col,
  Card,
  Breadcrumb,
} from "antd";
import { HomeOutlined, PlusOutlined } from "@ant-design/icons";
import Ribbon from "antd/es/badge/Ribbon";
import Paragraph from "antd/es/skeleton/Paragraph";

type QPermType = {
  name: string;
  value: number;
}[];

interface Group {
  groupName: string;
  userList: {
    realName: string;
    uuid: string;
  }[];
  permissionList: {
    name: string;
    value: number;
  }[];
  status: number;
  ignoreListType: number;
}

type QGroupType = Group[];

type QDataType<T> = T extends "plugin"
  ? string[]
  : T extends "group"
  ? QGroupType
  : T extends "perm"
  ? QPermType
  : string[];

async function queryParams<T extends "plugin" | "group" | "perm">(
  type: T,
  pluginName?: string
): Promise<{
  data: QDataType<T>;
  message: string;
  plugin: T extends "group" | "perm" ? string : undefined;
  status: number;
  type: T;
}> {
  const url = `${getBackendUrl()}/api/query?type=${type}${
    pluginName ? "&plugin=" + pluginName : ""
  }`;
  const dt = await axios.get(url, {
    headers: { Authorization: `Bearer ${getBackendSetting().token}` },
  });
  return dt.data;
}

// ======================================================================================================

let mSelectedPlugin: string, mSelectedGroup: string;

interface RenderProps {
  setCurrentStep: (step: number) => void;
}

const RenderPlugins: React.FC<RenderProps> = ({ setCurrentStep }) => {
  const [plugins, setPlugins] = useState<string[]>([]);

  useEffect(() => {
    queryParams("plugin").then((response) => {
      if (response.status === 200) {
        setPlugins(response.data);
      } else {
        message.error("加载插件列表失败: " + response.message);
      }
    });
  }, []);

  return (
    <div>
      <List
        bordered={true}
        grid={{
          gutter: 0,
          xs: 1,
          sm: 2,
          md: 3,
          lg: 3,
          xl: 4,
          xxl: 4,
        }}
        style={{
          height: "100hv",
          overflowY: "auto",
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
        dataSource={["__0_ADD", ...plugins]}
        renderItem={(mItem) => {
          if (mItem !== "__0_ADD") {
            return (
              <List.Item
                key={mItem as string}
                style={{ width: "100%", height: "100%" }}
              >
                <Card title={"插件"} actions={[<a>编辑</a>, <a>删除</a>]}>
                  {mItem}
                </Card>
              </List.Item>
            );
          }
          return (
            <List.Item>
              <Button
                key={"__0_ADD"}
                type="dashed"
                style={{ width: "100%", height: "201px" }}
              >
                <PlusOutlined /> 新建权限组
              </Button>
            </List.Item>
          );
        }}
      />
    </div>
  );
};

const RenderGroups: React.FC<RenderProps> = ({ setCurrentStep }) => {
  return <></>;
};

const RenderGroup: React.FC<RenderProps> = ({ setCurrentStep }) => {
  return <></>;
};

const RenderEditUser: React.FC<RenderProps> = ({ setCurrentStep }) => {
  return <></>;
};

const RenderEditPerm: React.FC<RenderProps> = ({ setCurrentStep }) => {
  return <></>;
};

// =============================================================================================================

export default function Manager() {
  const [currentStep, setCurrentStep] = useState(0);

  const handleBreadcrumb = (step: number) => {
    if (step === 0) {
      mSelectedPlugin = "";
      mSelectedGroup = "";
    }
    setCurrentStep(step);
  };

  const renderBreadcrumb = () => {
    return (
      <div style={{ marginBottom: "3px" }}>
        <Breadcrumb>
          <Breadcrumb.Item onClick={() => handleBreadcrumb(0)}>
            <HomeOutlined /> {mSelectedPlugin}
          </Breadcrumb.Item>
          {currentStep > 0 && (
            <Breadcrumb.Item onClick={() => handleBreadcrumb(1)}>
              权限组列表
            </Breadcrumb.Item>
          )}
          {currentStep > 1 && (
            <Breadcrumb.Item onClick={() => handleBreadcrumb(2)}>
              权限组详情
            </Breadcrumb.Item>
          )}
          {currentStep > 2 && (
            <Breadcrumb.Item onClick={() => handleBreadcrumb(3)}>
              用户编辑
            </Breadcrumb.Item>
          )}
          {currentStep > 3 && (
            <Breadcrumb.Item onClick={() => handleBreadcrumb(4)}>
              权限编辑
            </Breadcrumb.Item>
          )}
        </Breadcrumb>
      </div>
    );
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <RenderPlugins setCurrentStep={handleBreadcrumb} />;
      case 1:
        return <RenderGroups setCurrentStep={handleBreadcrumb} />;
      case 2:
        return <RenderGroup setCurrentStep={handleBreadcrumb} />;
      case 3:
        return <RenderEditUser setCurrentStep={handleBreadcrumb} />;
      case 4:
        return <RenderEditPerm setCurrentStep={handleBreadcrumb} />;
      default:
        handleBreadcrumb(0);
    }
  };

  return (
    <div>
      {renderBreadcrumb()}
      {renderStep()}
    </div>
  );
}
