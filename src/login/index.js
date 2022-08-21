import React, {Component} from "react";
import {Link} from "react-router";
import {Row, Col, Form, Icon, Input, Button} from "antd";
import FetchUtil from "../utils/FetchUtil";
import UrlUtil from "../utils/UrlUtil";
import "./login.css";

export default class Login extends Component {
    constructor(props) {
        super(props);
        const {
            searchParam: {redirectURL}
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
                    sendBefore: () => this.setState({loginBtnDis: true}),
                    success: ({data}) => {
                        localStorage.setItem("token", data);
                        window.location.href = unescape(this.state.redirectURL) || "/";
                    },
                    complete: () => this.setState({loginBtnDis: false})
                });
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {loginBtnDis, redirectURL} = this.state;
        return (
            <div className="login-page">
                <Row className="login-logo-row">
                    <Col span={6} offset={4}>
                        <Link to="/" onlyActiveOnIndex>
                            <img
                                alt="トップページ"
                                src="//img.alicdn.com/tfs/TB1_Gn8RXXXXXXqaFXXXXXXXXXX-380-54.png"
                            />
                        </Link>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} offset={9}>
                        <div className="login-warp">
                            <h2>登録</h2>
                            <Form onSubmit={this.handleSubmit} className="login-form">
                                <Form.Item>
                                    {getFieldDecorator("account", {
                                        rules: [
                                            {
                                                required: true,
                                                message: "携帯番号を入力してください"
                                            },
                                            {
                                                pattern: /^\d{1,32}$/,
                                                message: "携帯番号が違います"
                                            }
                                        ]
                                    })(
                                        <Input
                                            prefix={
                                                <Icon type="user" style={{color: "rgba(0,0,0)"}}/>
                                            }
                                            placeholder="携帯番号"
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator("password", {
                                        rules: [
                                            {
                                                required: true,
                                                message: "パスワードを入力してください"
                                            },
                                            {
                                                min: 6,
                                                max: 32,
                                                message: "長さは6かさ32までです"
                                            }
                                        ]
                                    })(
                                        <Input.Password
                                            prefix={
                                                <Icon type="lock" style={{color: "rgba(0,0,0)"}}/>
                                            }
                                            placeholder="パスワード"
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
                                    ログイン
                                </Button>
                            </Form>
                            <Row type="flex" justify="end" className="other-link-warp">
                                <Col span={12}>
                                    <Link
                                        to={`/forgetPwd${
                                            redirectURL ? `?redirectURL=${redirectURL}` : ""
                                        }`}
                                        onlyActiveOnIndex>
                                        パスワードを忘れた
                                    </Link>
                                </Col>
                                <Col span={5}>
                                    <Link
                                        to={`/register${
                                            redirectURL ? `?redirectURL=${redirectURL}` : ""
                                        }`}
                                        onlyActiveOnIndex>
                                        新規登録
                                    </Link>
                                </Col>
                            </Row>
                            <div className="more-sign">
                                <h6>外部サイトIDでログイン</h6>
                                <ul>
                                    <li>
                                        <a
                                            rel="noopener noreferrer"
                                            href="https://openauth.alipay.com/oauth2/publicAppAuthorize.htm?app_id=2016121904408215&scope=auth_user&redirect_uri=http%3a%2f%2ftmall.xiaomy.net%2falipayLogin"
                                        >
                                            <Icon type="alipay-circle" style={{color: "#1890ff"}}/>
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
