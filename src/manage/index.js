import React, { Component } from "react";
import { Layout, Menu } from 'antd';
import { browserHistory, Link } from 'react-router';
import UrlUtil from "../utils/UrlUtil";
import "antd/dist/antd.css";
import './manage.css'

const { Header, Content, Footer, Sider } = Layout;
export default class Manage extends Component {
    defaultSelectedKeys = ['personalInfo'];
    constructor(props) {
        super(props);
        const { pathname } = new UrlUtil(window.location);
        this.defaultSelectedKeys = [pathname[1]];
    }
    render() {
        return <Layout>
            <Header className="header">
                <Link to="/">
                    <img
                        className="logo"
                        alt="トップページ"
                        src="//img.alicdn.com/tfs/TB1_Gn8RXXXXXXqaFXXXXXXXXXX-380-54.png"
                    />
                </Link>
            </Header>
            <Content style={{ padding: '24px 50px' }}>
                <Layout className="site-layout-background">
                    <Sider className="site-layout-background" width={200}>
                        <Menu
                            theme="dark"
                            mode="inline"
                            defaultSelectedKeys={this.defaultSelectedKeys}
                            onSelect={item => {
                                browserHistory.push(`/manage/${item.key}`);
                            }}
                        >
                            <Menu.Item key="personalInfo">個人情報</Menu.Item>
                            <Menu.Item key="order">注文履歴</Menu.Item>
                            <Menu.Item key="address">アドレス帳</Menu.Item>
                        </Menu>
                    </Sider>
                    <Content className="manage-content">{this.props.children}</Content>
                </Layout>
            </Content>
            <Footer style={{ textAlign: 'center' }}>Ant Design ©2018 Created by Ant UED</Footer>
        </Layout>
    }
}