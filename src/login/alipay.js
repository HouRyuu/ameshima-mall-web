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
      success: ({ data }) => {
        localStorage.setItem("token", data);
        this.setState({
          loginStatus: 1
        });
      },
      error: () => {
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
          title="ログインが失敗しました。改めてログインを試してください"
          extra={
            <Button type="primary" key="console" href="/login">
              ログイン
            </Button>
          }
        />
      );
    }
    return (
      <Result
        status="success"
        title="ログイン完了。お買い物が楽しいように"
        extra={
          <Button type="primary" key="console" href="/">
            トップページ
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
