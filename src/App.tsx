import React, { useEffect, useState } from "react";
import {
  PieChartOutlined,
  TeamOutlined,
  InfoCircleOutlined,
  SettingOutlined,
  GithubOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Layout, Menu, theme } from "antd";
import { Outlet, useLocation } from "react-router";
import { NavLink } from "react-router-dom";
import { checkBackendSetting } from "./Backend/backend";

const { Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: string,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key: key,
    icon: icon,
    children: children,
    label: <NavLink to={key}>{label}</NavLink>,
  } as MenuItem;
}

const menuItems: MenuItem[] = [
  getItem("总览", "/Home", <PieChartOutlined />),
  getItem("管理", "/Manager", <TeamOutlined />),
  getItem("设置", "/Setting", <SettingOutlined />),
  getItem("关于", "/About", <InfoCircleOutlined />),
  getItem(
    "仓库",
    "https://github.com/engsr6982/PermissionCore-Web",
    <GithubOutlined />
  ),
];

const App = () => {
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();
  const [collapsed, setCollapsed] = useState(false);
  const [currentMenu, setCurrentMenu] = useState({});
  const [selectedKeys, setSelectedKeys] = useState([]);
  const location = useLocation();
  useEffect(() => {
    setSelectedKeys([location.pathname as never]);
    // @ts-ignore - 懒得写类型、ignore掉
    setCurrentMenu(menuItems.find((item) => item.key === location.pathname));
  }, [location]);

  checkBackendSetting();

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        theme="light"
        collapsed={collapsed}
        collapsedWidth={55}
        onCollapse={(value) => setCollapsed(value)}
      >
        <Menu
          theme="light"
          defaultSelectedKeys={["/Home"]}
          selectedKeys={selectedKeys}
          mode="inline"
          items={menuItems}
        />
      </Sider>
      <Layout style={{ height: "100vh" }}>
        <Content style={{ margin: "10px" }}>
          <div
            style={{
              padding: 16,
              height: "100%",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
            }}
          >
            <Outlet />
          </div>
        </Content>
        <Footer style={{ textAlign: "center" }}>
          PermissionCore-Web ©{new Date().getFullYear()} License GPL-3.0
        </Footer>
      </Layout>
    </Layout>
  );
};

export default App;
