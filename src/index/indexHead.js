import React, {Component} from "react";
import {browserHistory} from "react-router";
import {Link} from "react-router";
import {Row, Col, Menu, Dropdown, Icon, message} from "antd";
import FetchUtil from "../utils/FetchUtil";

export default class IndexHead extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loginInfo: null,
            cartCount: 0
        };
        this.loginInfo();
    }

    loginInfo() {
        const token = localStorage.getItem("token");
        const {loginRequire} = this.props;
        if (loginRequire && !token) {
            browserHistory.push({
                pathname: "/login",
                search: `?redirectURL=${escape(window.location)}`
            });
            return;
        }
        if (!token) return;
        FetchUtil.get({
            url: "/user/loginInfo",
            success: ({data}) => {
                this.setState({
                    loginInfo: data
                });
                this.getCartCount();
            },
            error: ({errMsg}) => {
                localStorage.removeItem("token");
                message.warning(errMsg, () => {
                    if (loginRequire) {
                        window.location = `/login?redirectURL=${escape(window.location)}`;
                    }
                });
            }
        });
    }

    logout() {
        FetchUtil.get({
            url: "/user/logout",
            success: () => {
                localStorage.removeItem("token");
                this.setState({
                    loginInfo: null,
                    cartCount: 0
                });
            }
        });
    }

    renderLoginInfo() {
        const {loginInfo} = this.state;
        if (loginInfo == null) {
            return (
                <p className="sn-login-info">
                    <em>ニヤー天猫へようこそ</em>
                    <Link
                        className="sn-login"
                        to={`/login?redirectURL=${escape(window.location)}`}
                        onlyActiveOnIndex>
                        ログイン
                    </Link>
                    <Link
                        className="sn-register"
                        to={`/register?redirectURL=${escape(window.location)}`}
                        onlyActiveOnIndex>
                        新規登録
                    </Link>
                </p>
            );
        }
        return (
            <p className="sn-login-info">
                <em>Hi，{loginInfo.nickName}</em>
                <Link
                    className="sn-login"
                    onClick={() => {
                        this.logout();
                    }}
                    onlyActiveOnIndex>
                    ログアウト
                </Link>
            </p>
        );
    }

    getCartCount() {
        FetchUtil.get({
            url: "/goods/shoppingCart/getCartCount",
            success: ({data}) => this.setState({cartCount: data})
        });
    }

    componentWillReceiveProps(props) {
        props.getCartCount && this.getCartCount();
    }

    render() {
        const {loginInfo, cartCount} = this.state;
        return (
            <div className="sn-bd">
                <Row type="flex" justify="space-between">
                    <Col span={5}>{this.renderLoginInfo()}</Col>
                    <Col span={3}>
                        <Dropdown overlay={
                            <Menu className="head-menu">
                                <Menu.Item>
                                    <Link to={
                                        loginInfo
                                            ? "/manage/order"
                                            : `/login?redirectURL=${escape(
                                                window.location.origin + "/manage/order"
                                            )}`
                                    } onlyActiveOnIndex>
                                        注文履歴
                                    </Link>
                                    <Link to={
                                        loginInfo
                                            ? "/manage/address"
                                            : `/login?redirectURL=${escape(
                                                window.location.origin + "/manage/address"
                                            )}`
                                    } onlyActiveOnIndex>
                                        アドレス帳
                                    </Link>
                                </Menu.Item>
                            </Menu>
                        }>
                            <Link className="ant-dropdown-link"
                                  to={
                                      loginInfo
                                          ? "/manage/personalInfo"
                                          : `/login?redirectURL=${escape(
                                              window.location.origin + "/manage/personalInfo"
                                          )}`
                                  }
                                  onlyActiveOnIndex>
                                マイ天猫
                                <Icon type="down"/>
                            </Link>
                        </Dropdown>
                        <Link
                            className="sn-cart-link"
                            to={
                                loginInfo
                                    ? "/shoppingCart"
                                    : `/login?redirectURL=${escape(
                                        window.location.origin + "/shoppingCart"
                                    )}`
                            }
                            onlyActiveOnIndex>
                            <Icon type="shopping-cart"/>
                            カート{cartCount}件
                        </Link>
                    </Col>
                </Row>
            </div>
        );
    }
}
