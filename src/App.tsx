import React, { SetStateAction, useEffect, useState } from "react";
import {
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  SettingFilled,
  HomeOutlined,
  LinkOutlined,
} from "@ant-design/icons";
import type { MenuProps } from "antd";
import { Breadcrumb, Layout, Menu, theme } from "antd";
import { Outlet, useLocation } from "react-router";
import { NavLink } from "react-router-dom";

const { Header, Content, Footer, Sider } = Layout;

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
  getItem("Home", "/Home", <HomeOutlined />),
  getItem("Links", "/Links", <LinkOutlined />),
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

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        theme="light"
        collapsed={collapsed}
        onCollapse={(value) => setCollapsed(value)}
      >
        <div className="demo-logo-vertical" />
        <Menu
          theme="light"
          defaultSelectedKeys={["/Home"]}
          selectedKeys={selectedKeys}
          mode="inline"
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header style={{ padding: 0, background: colorBgContainer }} />
        <Content style={{ margin: "16px 16px" }}>
          <div
            style={{
              padding: 24,
              minHeight: 360,
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
