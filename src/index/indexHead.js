import React, { Component } from "react";
import { Link } from 'react-router';
import { Row, Col, Menu, Dropdown, Icon, message } from "antd";
import { fetchUtil } from "../utils/FetchUtil";

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
    fetchUtil({
      url: "/user/loginInfo",
      callback: result => {
        const { errCode, errMsg, data } = result;
        if (errCode === 0) {
          this.setState({
            loginInfo: data
          });
					return;
        }
				const token = sessionStorage.getItem('token');
				if (token) {
					message.warning(errMsg);
					sessionStorage.removeItem('token');
				}
      }
    });
  }
  logout() {
    fetchUtil({
      url: "/user/logout",
      callback: result => {
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
        <a
          className="sn-login"
          rel="noopener noreferrer"
          onClick={() => {
            this.logout();
          }}
        >
          退出
        </a>
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
              <a className="ant-dropdown-link" href="#">
                我的天猫
                <Icon type="down" />
              </a>
            </Dropdown>
            <a className="sn-cart-link">
              <Icon type="shopping-cart" />
              购物车0件
            </a>
            <Dropdown overlay={favoritesMenu}>
              <a className="ant-dropdown-link" href="#">
                收藏夹
                <Icon type="down" />
              </a>
            </Dropdown>
          </Col>
        </Row>
      </div>
    );
  }
}
