import React, { Component } from "react";
import { Result, Button } from "antd";
import FetchUtil from "../utils/FetchUtil";

export default class AliPayLogin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginStatus: -1
    };
  }
  componentWillMount() {
    FetchUtil.get({
      url: `/user/alipay/auth${window.location.search}`,
      success: ({ errCode, data }) => {
        if (errCode === 0) {
          localStorage.setItem("token", data);
          this.setState({
            loginStatus: 1
          });
          return;
        }
        this.setState({
          loginStatus: 0
        });
      }
    });
  }
  showLoginResult(loginStatus) {
    if (loginStatus === -1) {
      return null;
    }
    if (loginStatus === 0) {
      return (
        <Result
          status="warning"
          title="登录失败，请尝试重新登录。"
          extra={
            <Button type="primary" key="console" href="/login">
              登录
            </Button>
          }
        />
      );
    }
    return (
      <Result
        status="success"
        title="登录成功，购物愉快哟。"
        extra={
          <Button type="primary" key="console" href="/">
            首页
          </Button>
        }
      />
    );
  }
  render() {
    const { loginStatus } = this.state;
    const loginResult = this.showLoginResult(loginStatus);
    return <div>{loginResult}</div>;
  }
}
