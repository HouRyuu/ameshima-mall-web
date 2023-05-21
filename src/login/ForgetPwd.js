import React, {Component} from "react";
import {Link} from "react-router";
import {Row, Col, Form, Icon, Input, Button, message} from "antd";
import FetchUtil from "../utils/FetchUtil";
import UrlUtil from "../utils/UrlUtil";
import "../login/login.css";

class ForgetForm extends Component {
    constructor(props) {
        super(props);
        const {
            searchParam: {redirectURL}
        } = new UrlUtil(window.location);
        this.state = {
            redirectURL,
            captchaBtnText: "キャプチャ",
            captchaBtnDis: false
        };
    }

    sendCaptcha = () => {
        const {form} = this.props;
        form.validateFields(["account"]);
        const account = form.getFieldValue("account");
        if (!form.getFieldError("account")) {
            FetchUtil.get({
                url: "/user/sendForgetCaptcha",
                data: {account},
                sendBefore: () => this.setState({captchaBtnDis: true}),
                success: ({data}) => {
                    const countDown = setInterval(() => {
                        this.setState({captchaBtnText: `${--data}s`});
                        if (data === 0) {
                            this.setState({
                                captchaBtnText: "キャプチャ",
                                captchaBtnDis: false
                            });
                            clearInterval(countDown);
                        }
                    }, 1000);
                },
                complete: () => this.setState({captchaBtnDis: false})
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
                    sendBefore: () => this.setState({regBtnDis: true}),
                    success: ({data}) => {
                        localStorage.setItem("token", data);
                        message.success(
                            "修正完了。妥当にパスワードを預かりますね^_^",
                            () =>
                                (window.location.href = unescape(this.state.redirectURL) || "/")
                        );
                    },
                    complete: () => this.setState({regBtnDis: false})
                });
            }
        });
    };

    render() {
        const {getFieldDecorator} = this.props.form;
        const {redirectURL, captchaBtnText, captchaBtnDis} = this.state;
        return (
            <div className="login-page">
                <Row className="login-logo-row">
                    <Col span={6} offset={4}>
                        <Link to="/" onlyActiveOnIndex>
                            <img
                                alt="トップページ"
                                src="/LOGO.png"
                            />
                        </Link>
                    </Col>
                </Row>
                <Row>
                    <Col span={6} offset={9}>
                        <div className="login-warp">
                            <h2>パスワードを忘れた</h2>
                            <Form onSubmit={this.handleSubmit} className="login-form">
                                <Form.Item>
                                    {getFieldDecorator("account", {
                                        rules: [
                                            {
                                                required: true,
                                                message: "メールアドレスを入力してください"
                                            },
                                            {
                                                type: 'email',
                                                message: "正しいメールアドレスを入力してください"
                                            }
                                        ]
                                    })(
                                        <Input
                                            prefix={
                                                <Icon type="mail"/>
                                            }
                                            placeholder="メールアドレス"
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item hasFeedback>
                                    {getFieldDecorator("password", {
                                        rules: [
                                            {
                                                required: true,
                                                message: "パスワードを入力してください"
                                            },
                                            {
                                                min: 6,
                                                max: 32,
                                                message: "長さは6桁かさ32桁までです"
                                            },
                                            {
                                                validator: (rule, value, callback) => {
                                                    const {form} = this.props;
                                                    if (value) {
                                                        form.validateFields(["confirm"], {force: true});
                                                    }
                                                    callback();
                                                }
                                            }
                                        ]
                                    })(
                                        <Input.Password
                                            prefix={<Icon type="lock"/>}
                                            placeholder="パスワード"
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item hasFeedback>
                                    {getFieldDecorator("confirm", {
                                        rules: [
                                            {
                                                required: true,
                                                message: "確認パスワードを入力してください"
                                            },
                                            {
                                                validator: (rule, value, callback) => {
                                                    const {form} = this.props;
                                                    if (
                                                        value &&
                                                        value !== form.getFieldValue("password")
                                                    ) {
                                                        callback("2回のパサワードが違います");
                                                        return;
                                                    }
                                                    callback();
                                                }
                                            }
                                        ]
                                    })(
                                        <Input.Password
                                            prefix={<Icon type="lock"/>}
                                            placeholder="確認パスワード"
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <Row gutter={8}>
                                        <Col span={14}>
                                            {getFieldDecorator("captcha", {
                                                rules: [
                                                    {
                                                        required: true,
                                                        message: "キャプチャを入力してください",
                                                        whitespace: true
                                                    },
                                                    {
                                                        len: 6,
                                                        message: " "
                                                    }
                                                ]
                                            })(
                                                <Input
                                                    prefix={<Icon type="message"/>}
                                                    placeholder="キャプチャ"
                                                />
                                            )}
                                        </Col>
                                        <Col span={10}>
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
                                    パスワードを修正
                                </Button>
                                <Row type="flex" justify="end" className="other-link-warp" style={{textAlign: 'right'}}>
                                    <Col span={6}>
                                        <Link
                                            to={`/login${
                                                redirectURL ? `?redirectURL=${redirectURL}` : ""
                                            }`}
                                            onlyActiveOnIndex>
                                            ログイン
                                        </Link>
                                    </Col>
                                    <Col span={6}>
                                        <Link
                                            to={`/register${
                                                redirectURL ? `?redirectURL=${redirectURL}` : ""
                                            }`} onlyActiveOnIndex>
                                            新規登録
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
