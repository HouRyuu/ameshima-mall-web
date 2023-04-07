import React, {Component} from "react";
import {Button, Descriptions, Input, message, Upload, Radio, Form} from "antd";
import FetchUtil from "../../utils/FetchUtil";
import {browserHistory} from "react-router";

const ButtonGroup = Button.Group;

class PersonalInfo extends Component {

    state = {
        avatarUpdateFlag: false,
        userInfo: {},
        updateFlag: false,
        submitting: false,
        newUserInfo: {}
    }

    componentWillMount() {
        this.getUser();
    }

    getUser() {
        FetchUtil.get({
            url: "/user/loginInfo",
            success: ({data: userInfo}) => this.setState({userInfo})
        });
    }

    changeAvatar({file: {status, response}}) {
        if (status === 'uploading') {
            this.setState({avatarUpdateFlag: true})
        }
        if (status === 'error') {
            this.setState({avatarUpdateFlag: false})
            message.error('アイコンのアップロードはエラーになってしまいました-_-!!');
            return;
        }
        if (status === 'done') {
            this.setState({avatarUpdateFlag: false})
            const {errCode, errMsg, data} = response;
            if (errMsg) {
                message.error(errMsg, () => {
                    if (errCode === 201 || errCode === 202) {
                        browserHistory.push({
                            pathname: "/login",
                            search: `?redirectURL=${escape(window.location)}`
                        });
                    }
                });
                return;
            }
            const {userInfo} = this.state;
            userInfo.avatar = data;
            this.setState({userInfo});
        }
    }

    beforeUpload(file) {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('JPG/PNGの写真だけ選べます');
            return false;
        }
        const isLt5M = file.size / 1024 / 1024 < 5;
        if (!isLt5M) {
            message.error('写真のサイズは5MBを超えられません');
            return false;
        }
        return true;
    }

    toUpdateOrCancel() {
        const {updateFlag, userInfo} = this.state;
        this.setState({updateFlag: !updateFlag, newUserInfo: {...userInfo}});
    }

    updateNewInfo(attrName, attrValue) {
        if (!attrValue || !attrValue.trim()) {
            return;
        }
        const {newUserInfo} = this.state;
        newUserInfo[attrName] = attrValue.trim();
        this.setState({newUserInfo});
    }

    submitUserInfo() {
        this.props.form.validateFields(err => {
            if (!err) {
                FetchUtil.put({
                        url: '/user/update',
                        data: this.state.newUserInfo,
                        sendBefore: () => this.setState({submitting: true}),
                        success: () => this.setState({updateFlag: false, userInfo: {...this.state.newUserInfo}}),
                        complete: () => this.setState({submitting: false})
                    }
                )
            }
        });
    }

    render() {
        const {getFieldDecorator} = this.props.form;
        const {avatarUpdateFlag, userInfo, updateFlag, submitting, newUserInfo} = this.state;
        const {nickName, account, accountType, avatar, gender} = userInfo;
        return <main>
            <Form onSubmit={e => {
                e.preventDefault();
                this.submitUserInfo();
            }}>
                <Descriptions layout="vertical">
                    <Descriptions.Item label="お名前">
                        {updateFlag ? <Form.Item>
                            {getFieldDecorator('nickName', {
                                initialValue: newUserInfo.nickName,
                                rules: [{required: true, message: 'お名前を入力してください'}]
                            })(
                                <Input maxLength={32}
                                       onChange={e => this.updateNewInfo('nickName', e.target.value)}/>,
                            )}
                        </Form.Item> : nickName}
                    </Descriptions.Item>
                    <Descriptions.Item label="メールアドレス">
                        {/*{updateFlag ? <Form.Item>
                            {getFieldDecorator('account', {
                                rules: [{required: true, message: 'お電話を入力してください'},
                                    {
                                        pattern: /^\d$/,
                                        message: "お電話のフォマートが違います"
                                    }],
                            })(
                                <Input maxLength={16} value={newUserInfo.account}
                                       onChange={(value) => this.updateNewInfo('account', value)}/>
                            )}
                        </Form.Item> : }*/account}
                    </Descriptions.Item>
                    <Descriptions.Item label="アイコン">
                        <Upload
                            disabled={!!accountType || avatarUpdateFlag}
                            accept=".png,.jpg,.jpeg"
                            action="//localhost:8080/user/avatar/upload"
                            headers={{token: localStorage.getItem("token")}}
                            name="avatarFile"
                            listType="picture-card"
                            showUploadList={false}
                            beforeUpload={(file) => this.beforeUpload(file)}
                            onChange={(info) => this.changeAvatar(info)}
                        >
                            <img style={{width: "128px", height: "128px"}} src={avatar} alt=""/>
                        </Upload>
                    </Descriptions.Item>
                    <Descriptions.Item label="性別">
                        {updateFlag ? <Radio.Group defaultValue={newUserInfo.gender}
                                                   onChange={e => this.updateNewInfo('gender', e.target.value)}>
                            <Radio.Button value="m">男</Radio.Button>
                            <Radio.Button value="s">内緒</Radio.Button>
                            <Radio.Button value="f">女</Radio.Button>
                        </Radio.Group> : gender === "m" ? "男" : gender === "f" ? "女" : "内緒"}
                    </Descriptions.Item>
                    <Descriptions.Item label="パスワード">******</Descriptions.Item>
                    <Descriptions.Item label="操作">
                        {
                            updateFlag ? <ButtonGroup>
                                <Button onClick={() => this.toUpdateOrCancel()}>取消</Button>
                                <Button type="primary" htmlType="submit" loading={submitting}>修正</Button>
                            </ButtonGroup> : <Button onClick={() => this.toUpdateOrCancel()}>アップデート</Button>
                        }
                    </Descriptions.Item>
                </Descriptions>
            </Form>
        </main>;
    }
}

export default PersonalInfo = Form.create({name: 'UserInfoForm'})(PersonalInfo);