import React, { Component } from "react";
import { Link } from "react-router";
import { Row, Col, Form, Icon, Input, Button, message } from "antd";
import FetchUtil from "../utils/FetchUtil";
import UrlUtil from "../utils/UrlUtil";
import "../login/login.css";

class ForgetForm extends Component {
  constructor(props) {
    super(props);
    const {
      searchParam: { redirectURL }
    } = new UrlUtil(window.location);
    this.state = {
      redirectURL,
      captchaBtnText: "获取验证码",
      captchaBtnDis: false
    };
  }
  sendCaptcha = () => {
    const { form } = this.props;
    form.validateFields(["account"]);
    const account = form.getFieldValue("account");
    if (!form.getFieldError("account")) {
      FetchUtil.get({
        url: "/user/sendForgetCaptcha",
        data: { account },
        sendBefore: () => this.setState({ captchaBtnDis: true }),
        success: ({ data }) => {
          const countDown = setInterval(() => {
            this.setState({ captchaBtnText: `${--data}s` });
            if (data === 0) {
              this.setState({
                captchaBtnText: "获取验证码",
                captchaBtnDis: false
              });
              clearInterval(countDown);
            }
          }, 1000);
        },
        complete: () => this.setState({ captchaBtnDis: false })
      });
    }
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        FetchUtil.post({
          url: "/user/forgetPwd",
          data: values,
          sendBefore: () => this.setState({ regBtnDis: true }),
          success: ({ data }) => {
            localStorage.setItem("token", data);
            message.success(
              "修改成功啦！请保管好您的密码哦^_^",
              () =>
                (window.location.href = unescape(this.state.redirectURL) || "/")
            );
          },
          complete: () => this.setState({ regBtnDis: false })
        });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { redirectURL, captchaBtnText, captchaBtnDis } = this.state;
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
              <h2>忘记密码</h2>
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
                      prefix={<Icon type="mobile" />}
                      placeholder="手机号"
                    />
                  )}
                </Form.Item>
                <Form.Item hasFeedback>
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
                      },
                      {
                        validator: (rule, value, callback) => {
                          const { form } = this.props;
                          if (value) {
                            form.validateFields(["confirm"], { force: true });
                          }
                          callback();
                        }
                      }
                    ]
                  })(
                    <Input.Password
                      prefix={<Icon type="lock" />}
                      placeholder="密码"
                    />
                  )}
                </Form.Item>
                <Form.Item hasFeedback>
                  {getFieldDecorator("confirm", {
                    rules: [
                      {
                        required: true,
                        message: "请输入确认密码！"
                      },
                      {
                        validator: (rule, value, callback) => {
                          const { form } = this.props;
                          if (
                            value &&
                            value !== form.getFieldValue("password")
                          ) {
                            callback("两次输入的密码不一致！");
                            return;
                          }
                          callback();
                        }
                      }
                    ]
                  })(
                    <Input.Password
                      prefix={<Icon type="lock" />}
                      placeholder="确认密码"
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  <Row gutter={8}>
                    <Col span={12}>
                      {getFieldDecorator("captcha", {
                        rules: [
                          {
                            required: true,
                            message: "请输入验证码!",
                            whitespace: true
                          },
                          {
                            len: 6,
                            message: " "
                          }
                        ]
                      })(
                        <Input
                          prefix={<Icon type="message" />}
                          placeholder="验证码"
                        />
                      )}
                    </Col>
                    <Col span={12}>
                      <Button
                        disabled={captchaBtnDis}
                        onClick={this.sendCaptcha}
                      >
                        {captchaBtnText}
                      </Button>
                    </Col>
                  </Row>
                </Form.Item>
                <Button
                  type="danger"
                  shape="round"
                  size="large"
                  htmlType="submit"
                  className="login-button"
                >
                  修改密码
                </Button>
                <Row type="flex" justify="end" className="other-link-warp">
                  <Col span={4}>
                    <Link
                      to={`/login${
                        redirectURL ? `?redirectURL=${redirectURL}` : ""
                      }`}
                    >
                      登录
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
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
const ForgetPwd = Form.create()(ForgetForm);
export default ForgetPwd;
