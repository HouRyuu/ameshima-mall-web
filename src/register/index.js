import React, {Component} from "react";
import {Link} from "react-router";
import {Row, Col, Form, Icon, Input, Button, message, Checkbox} from "antd";
import Protocol from "../components/Protocol";
import FetchUtil from "../utils/FetchUtil";
import UrlUtil from "../utils/UrlUtil";
import "../login/login.css";

class RegisterForm extends Component {
    constructor(props) {
        super(props);
        const {
            searchParam: {redirectURL}
        } = new UrlUtil(window.location);
        this.state = {
            redirectURL,
            protocolVisible: false,
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
                url: "/user/sendRegisterCaptcha",
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
                    url: "/user/register",
                    data: values,
                    sendBefore: () => this.setState({regBtnDis: true}),
                    success: ({data}) => {
                        localStorage.setItem("token", data);
                        message.success(
                            "登録完了。早くお買い物に行きましょう^_^",
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
        const {
            redirectURL,
            protocolVisible,
            captchaBtnText,
            captchaBtnDis
        } = this.state;
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
                            <h2>新規登録</h2>
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
                                            maxLength={16}
                                            prefix={<Icon type="mail"/>}
                                            placeholder="携帯番号"
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
                                            maxLength={32}
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
                                            max={32}
                                            prefix={<Icon type="lock"/>}
                                            placeholder="確認パスワード"
                                        />
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    {getFieldDecorator("nickName", {
                                        rules: [
                                            {
                                                required: true,
                                                message: "ニックネームを入力してください",
                                                whitespace: true
                                            },
                                            {
                                                max: 16,
                                                message: "長さは16までです"
                                            }
                                        ]
                                    })(
                                        <Input prefix={<Icon type="user"/>} placeholder="ニックネーム" maxLength={16}/>
                                    )}
                                </Form.Item>
                                <Form.Item>
                                    <Row gutter={8}>
                                        <Col span={12}>
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
                                    登録
                                </Button>
                                <Form.Item>
                                    {getFieldDecorator("agreement", {
                                        valuePropName: "checked",
                                        rules: [
                                            {
                                                required: true,
                                                message: "協議を同意してください"
                                            }
                                        ]
                                    })(
                                        <Checkbox style={{fontSize: 12}}>
                                            <Button
                                                type="link"
                                                style={{padding: 0, fontSize: 12}}
                                                onClick={() => this.setState({protocolVisible: true})}
                                            >
                                                入会協議
                                            </Button>
                                            を読んで認めた
                                        </Checkbox>
                                    )}
                                    <Link
                                        className="toLogin-link"
                                        to={`/login${
                                            redirectURL ? `?redirectURL=${redirectURL}` : ""
                                        }`}
                                        onlyActiveOnIndex>
                                        ログイン
                                    </Link>
                                </Form.Item>
                            </Form>
                            <Protocol
                                visible={protocolVisible}
                                onCancel={() => this.setState({protocolVisible: false})}
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
