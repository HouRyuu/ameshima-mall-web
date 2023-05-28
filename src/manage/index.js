import React, {Component} from "react";
import {Layout, Menu, Button, Row, Col} from 'antd';
import {browserHistory, Link} from 'react-router';
import UrlUtil from "../utils/UrlUtil";
import "antd/dist/antd.css";
import './manage.css'
import FetchUtil from "../utils/FetchUtil";
import SubMenu from "antd/es/menu/SubMenu";

const {Header, Content, Footer, Sider} = Layout;
export default class Manage extends Component {
    defaultSelectedKeys = ['personalInfo'];

    state = {
        menuList: [{
            menu: "個人情報",
            menuUrl: "personalInfo"
        }, {
            menu: "注文履歴",
            menuUrl: "order"
        }, {
            menu: "アドレス帳",
            menuUrl: "address"
        }, {
            menu: "店舗管理",
            childrenMenus: [{
                menu: "店舗ページ",
                menuUrl: "store"
            }]
        }]
    }

    constructor(props) {
        super(props);
        const {pathname} = new UrlUtil();
        this.defaultSelectedKeys = [pathname[1]];
    }

    componentDidMount() {
        this.findMenu();
    }

    findMenu() {
        FetchUtil.get({
            url: "/user/menu",
            success: ({data: menuList}) => this.setState({menuList})
        })
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
        const {menuList} = this.state;
        return <Layout>
            <Header className="header">
                <Row>
                    <Col span={3}>
                        <Link to="/" onlyActiveOnIndex>
                            <img
                                className="logo"
                                alt="トップページ"
                                src={`${window.origin}/LOGO.png`}
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
                            {
                                menuList.map(({menu, menuUrl, childrenMenus}, index) => {
                                    if (childrenMenus && childrenMenus.length) {
                                        return <SubMenu title={menu} key={index}>
                                            {childrenMenus.map((menuItem) => {
                                                return <Menu.Item key={menuItem.menuUrl}>{menuItem.menu}</Menu.Item>
                                            })}
                                        </SubMenu>
                                    } else {
                                        return <Menu.Item key={menuUrl}>{menu}</Menu.Item>
                                    }
                                })
                            }
                        </Menu>
                    </Sider>
                    <Content className="manage-content">{this.props.children}</Content>
                </Layout>
            </Content>
            <Footer style={{textAlign: 'center'}}>雨島MALL ©2022 Created by 雨島</Footer>
        </Layout>;
    }
}