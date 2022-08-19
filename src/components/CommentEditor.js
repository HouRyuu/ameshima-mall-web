import {Avatar, Button, Comment, Form, Input, Rate} from "antd";
import React, {Component} from "react";
import FetchUtil from "../utils/FetchUtil";

const {TextArea} = Input;
export default class CommentEditor extends Component {
    state = {
        avatar: "",
        descScore: 5,
        evaluateText: "",
        submitting: false
    }

    componentWillMount() {
        this.loginInfo();
    }

    loginInfo() {
        FetchUtil.get({
            url: "/user/loginInfo",
            success: ({data: {avatar}}) => this.setState({avatar})
        });
    }

    render() {
        const {submit, submitting} = this.props;
        const {avatar, descScore, evaluateText} = this.state;
        return <Comment avatar={<Avatar src={avatar}/>}
                        content={<div>
                            <Form.Item>
                                <TextArea maxLength={256} rows={4} onChange={e => this.setState({
                                    evaluateText: e.target.value,
                                })} value={evaluateText}/>
                            </Form.Item>
                            <Form.Item>
                                <Rate　style={{marginRight: "10px"}} allowHalf tooltips={["悪い", "良くない", "普通", "良い", "素晴らしい"]}
                                      value={descScore} onChange={descScore => this.setState({descScore})}/>
                                <Button htmlType="submit" loading={submitting}
                                        onClick={() => submit({descScore, evaluateText})}
                                        type="primary">
                                    コメント
                                </Button>
                            </Form.Item>
                        </div>
                        }
        />
    }
}