import React, { Component } from "react";
import { Link } from "react-router";
import { Row, Col, Form, Icon, Input, Button, message } from "antd";
import FetchUtil from "../utils/FetchUtil";
import UrlUtil from "../utils/UrlUtil";
import "./login.css";

export default class Login extends Component {
  constructor(props) {
    super(props);
    const {
      searchParam: { redirectURL }
    } = new UrlUtil(window.location);
    this.state = {
      redirectURL,
      loginBtnDis: false
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        FetchUtil.post({
          url: "/user/login",
          data: values,
          sendBefore: () => this.setState({ loginBtnDis: true }),
          success: ({ errCode, errMsg, data }) => {
            if (errCode === 0) {
              localStorage.setItem("token", data);
              window.location.href = unescape(this.state.redirectURL) || "/";
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
    const { loginBtnDis, redirectURL } = this.state;
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
                    rules: [
                      {
                        required: true,
                        message: "请输入手机号！"
                      },
                      {
                        pattern: /^1[3-8]\d{9}$/,
                        message: "手机号格式错误！"
                      }
                    ]
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
                    rules: [
                      {
                        required: true,
                        message: "请输入密码！"
                      },
                      {
                        min: 6,
                        max: 32,
                        message: "长度介于6至32位间！"
                      }
                    ]
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
                  <Link
                    to={`/forgetPwd${
                      redirectURL ? `?redirectURL=${redirectURL}` : ""
                      }`}
                  >
                    忘记密码
                  </Link>
                </Col>
                <Col span={6}>
                  <Link
                    to={`/register${
                      redirectURL ? `?redirectURL=${redirectURL}` : ""
                      }`}
                  >
                    免费注册
                  </Link>
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
