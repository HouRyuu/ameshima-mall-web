import React, { Component } from "react";
import { Link } from "react-router";
import { Row, Col, Form, Icon, Input, Button, message, Checkbox } from "antd";
import Protocol from "../components/Protocol";
import { fetchUtil } from "../utils/FetchUtil";
import "../login/login.css";

class RegisterForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      protocolVisible: false,
      captchaBtnText: "获取验证码",
      captchaBtnDis: false,
      regInfo: {
        account: "",
        password: "",
        nickName: "",
        captcha: ""
      }
    };
  }
  sendCaptcha = () => {
    const { form } = this.props;
    form.validateFields(["account"]);
    const account = form.getFieldValue("account");
    if (!form.getFieldError("account")) {
      fetchUtil({
        url: "/user/sendRegisterCaptcha",
        body: { account },
        sendBefore: () => this.setState({ captchaBtnDis: true }),
        callback: ({ errCode, data }) => {
          const countDown = setInterval(() => {
            this.setState({ captchaBtnText: `${--data}s` });
            if (data == 0) {
              this.setState({
                captchaBtnText: "获取验证码",
                captchaBtnDis: false
              });
              clearInterval(countDown);
            }
          }, 1000);
        }
      });
    }
  };
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
        fetchUtil({
          url: "/user/register",
          method: "post",
          body: values,
          sendBefore: () => this.setState({ regBtnDis: true }),
          callback: ({ errCode, errMsg, data }) => {
            if (!errCode) {
              sessionStorage.setItem("token", data);
              message.success(
                "注册成功啦！快去购物吧^_^",
                () => (window.location.href = "/")
              );
              return;
            }
            message.error(errMsg);
          }
        });
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const {
      protocolVisible,
      captchaBtnText,
      captchaBtnDis,
      regInfo: { account, password, nickName, captcha }
    } = this.state;
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
              <h2>注册</h2>
              <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                  {getFieldDecorator("account", {
                    rules: [
                      {
                        required: true,
                        message: "请输入手机号！",
                        whitespace: true
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
                  {getFieldDecorator("nickName", {
                    rules: [
                      {
                        required: true,
                        message: "请输入昵称！",
                        whitespace: true
                      },
                      {
                        max: 16,
                        message: "长度不得超过16个字符！"
                      }
                    ]
                  })(
                    <Input prefix={<Icon type="user" />} placeholder="昵称" />
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
                  注册
                </Button>
                <Form.Item>
                  {getFieldDecorator("agreement", {
                    valuePropName: "checked",
                    rules: [
                      {
                        required: true,
                        message: "请仔细阅读并同意隐私协议！"
                      }
                    ]
                  })(
                    <Checkbox style={{ fontSize: 12 }}>
                      我已阅读并同意
                      <Button
                        type="link"
                        style={{ padding: 0, fontSize: 12 }}
                        onClick={() => this.setState({ protocolVisible: true })}
                      >
                        入会协议
                      </Button>
                    </Checkbox>
                  )}
                  <Link className="toLogin-link" to="/login">
                    登录
                  </Link>
                </Form.Item>
              </Form>
              <Protocol
                visible={protocolVisible}
                onCancel={() => this.setState({ protocolVisible: false })}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
const Register = Form.create()(RegisterForm);
export default Register;
