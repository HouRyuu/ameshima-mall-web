import React, { Component } from "react";
import { Row, Col, Form, Icon, Input, Button, message, Checkbox } from "antd";
import { fetchUtil } from "../utils/FetchUtil";
import "../login/login.css";

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      btnDis: false
    };
  }
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log("Received values of form: ", values);
      }
    });
  };
  render() {
    const { getFieldDecorator } = this.props.form;
    const { btnDis } = this.state;
    return (
      <div className="login-page">
        <Row className="login-logo-row">
          <Col span={6} offset={4}>
            <a rel="noopener noreferrer" href="/">
              <img
                alt="首页"
                src="//img.alicdn.com/tfs/TB1_Gn8RXXXXXXqaFXXXXXXXXXX-380-54.png"
              />
            </a>
          </Col>
        </Row>
        <Row>
          <Col span={6} offset={9}>
            <div className="login-warp">
              <h2>注册</h2>
              <Form onSubmit={this.handleSubmit} className="login-form">
                <Form.Item>
                  {getFieldDecorator("account", {
                    rules: [{ required: true, message: "请输入手机号！" }]
                  })(
                    <Input
                      prefix={<Icon type="mobile" />}
                      placeholder="手机号"
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator("password", {
                    rules: [{ required: true, message: "请输入密码！" }]
                  })(
                    <Input.Password
                      prefix={<Icon type="lock" />}
                      placeholder="密码"
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator("confirm", {
                    rules: [{ required: true, message: "请输入确认密码！" }]
                  })(
                    <Input.Password
                      prefix={<Icon type="lock" />}
                      placeholder="确认密码"
                    />
                  )}
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator("nickName", {
                    rules: [{ required: true, message: "请输入昵称！" }]
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
                            message: "请输入验证码!"
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
                      <Button>获取验证码</Button>
                    </Col>
                  </Row>
                </Form.Item>
                <Form.Item>
                  {getFieldDecorator("agreement", {
                    valuePropName: "checked"
                  })(
                    <Checkbox>
                      I have read the <Button type="link" style={{padding: 0}}>greement</Button>
                    </Checkbox>
                  )}
                </Form.Item>
                <Button
                  disabled={btnDis}
                  type="danger"
                  shape="round"
                  size="large"
                  htmlType="submit"
                  className="login-button"
                >
                  注册
                </Button>
              </Form>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}
Register = Form.create()(Register);
