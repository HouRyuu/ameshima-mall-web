import React, {Component} from "react";
import {Layout, Menu, Button, Row, Col} from 'antd';
import {browserHistory, Link} from 'react-router';
import UrlUtil from "../utils/UrlUtil";
import "antd/dist/antd.css";
import './manage.css'
import FetchUtil from "../utils/FetchUtil";

const {Header, Content, Footer, Sider} = Layout;
export default class Manage extends Component {
    defaultSelectedKeys = ['personalInfo'];

    constructor(props) {
        super(props);
        const {pathname} = new UrlUtil(window.location);
        this.defaultSelectedKeys = [pathname[1]];
    }

    logout() {
        FetchUtil.get({
            url: "/user/logout",
            success: () => {
                localStorage.removeItem("token");
                browserHistory.push({
                    pathname: "/"
                });
            }
        });
    }

    render() {
        return <Layout>
            <Header className="header">
                <Row>
                    <Col span={3}>
                        <Link to="/" onlyActiveOnIndex>
                            <img
                                className="logo"
                                alt="トップページ"
                                src="/LOGO.png"
                            />
                        </Link>
                    </Col>
                    <Col span={2} offset={19}>
                        <Button type="link" icon="logout" onClick={() => this.logout()}>ログアウト</Button>
                    </Col>
                </Row>
            </Header>
            <Content style={{padding: '24px 50px'}}>
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
            <Footer style={{textAlign: 'center'}}>雨島MALL ©2022 Created by 雨島</Footer>
        </Layout>;
    }
}