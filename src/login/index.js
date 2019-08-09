import React, { Component } from "react";
import { Link } from "react-router";
import { Row, Col, Form, Icon, Input, Button, message } from "antd";
import { fetchUtil } from "../utils/FetchUtil";
import "./login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginBtnDis: false
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        fetchUtil({
          url: "/user/login",
          method: "POST",
          body: values,
          sendBefore: () => this.setState({ loginBtnDis: true }),
          callback: ({ errCode, errMsg, data }) => {
            if (errCode === 0) {
              sessionStorage.setItem("token", data);
              window.location.href = "/";
              return;
            }
            message.error(errMsg);
          },
          complete: () => this.setState({ loginBtnDis: false })
        });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { loginBtnDis } = this.state;
    return (
      <div className="login-page">
        <Row className="login-logo-row">
          <Col span={6} offset={4}>
            <Link to="/">
              <img
                alt="首页"
                src="//img.alicdn.com/tfs/TB1_Gn8RXXXXXXqaFXXXXXXXXXX-380-54.png"
              />
            </Link>
          </Col>
        </Row>
        <Row>
          <Col span={6} offset={9}>
            <div className="login-warp">
              <h2>登录</h2>
              <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                  {getFieldDecorator("account", {
                    rules: [{ required: true, message: "请输入手机号！" }]
                  })(
                    <Input
                      prefix={
                        <Icon type="user" style={{ color: "rgba(0,0,0)" }} />
                      }
                      placeholder="手机号"
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator("password", {
                    rules: [{ required: true, message: "请输入密码！" }]
                  })(
                    <Input.Password
                      prefix={
                        <Icon type="lock" style={{ color: "rgba(0,0,0)" }} />
                      }
                      placeholder="密码"
                    />
                  )}
                </Form.Item>
                <Button
                  disabled={loginBtnDis}
                  type="danger"
                  shape="round"
                  size="large"
                  htmlType="submit"
                  className="login-button"
                >
                  登录
                </Button>
              </Form>
              <Row type="flex" justify="end" className="other-link-warp">
                <Col span={6}>
                  <a rel="noopener noreferrer">忘记密码</a>
                </Col>
                <Col span={6}>
                  <Link to="/register">免费注册</Link>
                </Col>
              </Row>
              <div className="more-sign">
                <h6>社交帐号登录</h6>
                <ul>
                  <li>
                    <a
                      rel="noopener noreferrer"
                      href="https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2016121904408215&scope=auth_user&redirect_uri=http%3a%2f%2ftmall.xiaomy.net%2falipayLogin"
                    >
                      <Icon type="alipay-circle" style={{ color: "#1890ff" }} />
                    </a>
                  </li>
                  <li>
                    <Icon type="wechat" style={{ color: "#00bb29" }} />
                  </li>
                  <li>
                    <Icon type="qq" style={{ color: "#498ad5" }} />
                  </li>
                </ul>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
Login = Form.create()(Login);
