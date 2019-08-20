import React, { Component } from "react";
import { Link } from "react-router";
import { Row, Col, Menu, Dropdown, Icon, message } from "antd";
import FetchUtil from "../utils/FetchUtil";

const myTmallMenu = (
  <Menu className="head-menu">
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="http://www.alipay.com/"
      >
        已买到的宝贝
      </a>
    </Menu.Item>
  </Menu>
);
const favoritesMenu = (
  <Menu className="head-menu">
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="http://www.alipay.com/"
      >
        收藏的宝贝
      </a>
    </Menu.Item>
    <Menu.Item>
      <a
        target="_blank"
        rel="noopener noreferrer"
        href="http://www.alipay.com/"
      >
        收藏的店铺
      </a>
    </Menu.Item>
  </Menu>
);
export default class IndexHead extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginInfo: null
    };
  }
  loginInfo() {
    const token = localStorage.getItem("token");
    if (!token) return;
    FetchUtil.get({
      url: "/user/loginInfo",
      success: result => {
        const { errCode, errMsg, data } = result;
        if (errCode === 0) {
          this.setState({
            loginInfo: data
          });
          return;
        }
        message.warning(errMsg);
        localStorage.removeItem("token");
      }
    });
  }
  logout() {
    FetchUtil.get({
      url: "/user/logout",
      success: result => {
        localStorage.removeItem("token");
        this.setState({
          loginInfo: null
        });
      }
    });
  }
  renderLoginInfo() {
    const { loginInfo } = this.state;
    if (loginInfo == null) {
      return (
        <p className="sn-login-info">
          <em>喵，欢迎来天猫</em>
          <Link className="sn-login" to="/login">
            请登录
          </Link>
          <Link className="sn-register" to="/register">
            免费注册
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
        >
          退出
        </Link>
      </p>
    );
  }
  componentWillMount() {
    this.loginInfo();
  }
  render() {
    return (
      <div className="sn-bd">
        <Row type="flex" justify="space-between">
          <Col span={5}>{this.renderLoginInfo()}</Col>
          <Col span={5}>
            <Dropdown overlay={myTmallMenu}>
              <Link className="ant-dropdown-link">
                我的天猫
                <Icon type="down" />
              </Link>
            </Dropdown>
            <Link className="sn-cart-link">
              <Icon type="shopping-cart" />
              购物车0件
            </Link>
            <Dropdown overlay={favoritesMenu}>
              <Link className="ant-dropdown-link">
                收藏夹
                <Icon type="down" />
              </Link>
            </Dropdown>
          </Col>
        </Row>
      </div>
    );
  }
}
