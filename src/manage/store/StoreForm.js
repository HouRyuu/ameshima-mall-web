import React, {Component} from "react";
import {Drawer, Form, Button, Col, Row, Input, Select, Upload, Icon, message} from 'antd';
import Region from "../../utils/Region";
import FetchUtil from "../../utils/FetchUtil";
import FileUtil from "../../utils/FileUtil";
import {browserHistory} from "react-router";

const {Option} = Select;
export default class StoreForm extends Component {
    state = {
        region: Region.INSTANCE,
        store: {},
        validateStatus: {},
        uploadingFlag: false,
    }

    onClose() {
        this.setState({
            store: {},
            validateStatus: {}
        });
        const {close} = this.props;
        if (close) {
            close();
        }
    }

    validation() {
        const {validateStatus, store} = this.state;
        const keys = ['storeName', 'company', 'phone', 'businessLicense', 'provinceCode', 'cityCode', 'districtCode', 'detailedAddress'];
        let flag = true;
        keys.forEach(key => {
            validateStatus[key] = !!store[key] ? 'success' : 'error';
            if (flag) flag = !!store[key];
        })
        this.setState({validateStatus});
        return flag;
    }

    changeImg({file: {status, response}}) {
        if (status === 'uploading') {
            this.setState({uploadingFlag: true})
        }
        if (status === 'error') {
            this.setState({uploadingFlag: false})
            message.error('アップロードはエラーになってしまいました-_-!!');
            return;
        }
        if (status === 'done') {
            this.setState({uploadingFlag: false})
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
            const {store, validateStatus} = this.state;
            store.businessLicense = data;
            validateStatus['businessLicense'] = 'success';
            this.setState({store, validateStatus});
        }
    }

    submitStore() {
        if (this.validation()) {
            FetchUtil.put({
                url: '/user/store/register',
                data: this.state.store,
                success: () => {
                    message.info(
                        '店舗登録をいただき、誠にありがとうございます。早速売買を始めましょう',
                        () => {
                            this.onClose();
                            window.location.reload();
                        }
                    );
                }
            })
        }
    }

    render() {
        const {visible} = this.props;
        const {
            store,
            validateStatus,
            region
        } = this.state;
        const {provinceList = [], cityList = [], districtList = []} = region;
        return <Drawer
            title="店舗登録"
            placement="left"
            width={720}
            onClose={() => this.onClose()}
            visible={visible}
            bodyStyle={{paddingBottom: 80}}
        >
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="店舗名" hasFeedback validateStatus={validateStatus.storeName}>
                            <Input placeholder="店舗名をご入力下さい" value={store.storeName}
                                   maxLength={32}
                                   onChange={({target: {value}}) => {
                                       store.storeName = value;
                                       validateStatus['storeName'] = !!value ? 'success' : 'error';
                                       this.setState({store, validateStatus});
                                   }}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="会社名" hasFeedback validateStatus={validateStatus.company}>
                            <Input placeholder="会社名をご入力下さい" value={store.company}
                                   maxLength={32}
                                   onChange={({target: {value}}) => {
                                       store.company = value;
                                       validateStatus['company'] = !!value ? 'success' : 'error';
                                       this.setState({store, validateStatus});
                                   }}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="電話番号(ハイフォンなし)" hasFeedback validateStatus={validateStatus.phone}>
                            <Input placeholder="お電話をご入力下さい" value={store.phone}
                                   maxLength={16}
                                   onChange={({target: {value}}) => {
                                       if (isNaN(value)) {
                                           return;
                                       }
                                       store.phone = value.trim();
                                       validateStatus['phone'] = !!store.phone ? 'success' : 'error';
                                       this.setState({store, validateStatus});
                                   }}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="経営ライセンス写真" hasFeedback validateStatus={validateStatus.businessLicense}>
                            <Upload
                                accept=".png,.jpg,.jpeg"
                                action="//www.ameshima-mall.com/api/basic/img/upload"
                                headers={{token: localStorage.getItem("token")}}
                                name="img"
                                listType="picture-card"
                                showUploadList={false}
                                beforeUpload={(file) => FileUtil.beforeUpload(file)}
                                onChange={(info) => this.changeImg(info)}
                            >
                                {
                                    !store.businessLicense ? <div>
                                            <Icon type="plus"/>
                                            <div>アップロード</div>
                                        </div> :
                                        <img style={{width: 98, height: 98}} src={store.businessLicense}
                                             alt=""/>
                                }
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="都道府県" hasFeedback validateStatus={validateStatus.provinceCode}>
                            <Select placeholder="都道府県をお選び下さい" value={store.provinceCode}
                                    onChange={(value) => {
                                        store.provinceCode = value;
                                        validateStatus['provinceCode'] = !!value ? 'success' : 'error';
                                        store.cityCode = undefined;
                                        store.districtCode = undefined;
                                        region.initRegion(region.setCityList, value, undefined, 2, () =>
                                            this.setState({store, validateStatus})
                                        );
                                    }}>
                                {provinceList.map(({regionCode, regionName}) =>
                                    <Option key={regionCode} value={regionCode}>{regionName}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="市区村" hasFeedback validateStatus={validateStatus.cityCode}>
                            <Select placeholder="お選び下さい" value={store.cityCode}
                                    onChange={(value) => {
                                        store.cityCode = value;
                                        store.districtCode = undefined;
                                        validateStatus['cityCode'] = !!value ? 'success' : 'error';
                                        region.initRegion(region.setDistrictList, value, store.provinceCode, 3, () =>
                                            this.setState({store, validateStatus})
                                        );
                                    }}>
                                {cityList.map(({regionCode, regionName}) =>
                                    <Option key={regionCode} value={regionCode}>{regionName}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="町" hasFeedback validateStatus={validateStatus.districtCode}>
                            <Select placeholder="お選び下さい" value={store.districtCode}
                                    onChange={(value) => {
                                        store.districtCode = value;
                                        validateStatus['districtCode'] = !!value ? 'success' : 'error';
                                        this.setState({store, validateStatus});
                                    }}>
                                {districtList.map(({regionCode, regionName}) =>
                                    <Option key={regionCode} value={regionCode}>{regionName}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item label="詳細住所" hasFeedback validateStatus={validateStatus.detailedAddress}>
                            <Input.TextArea rows={4} placeholder="詳細住所をご入力下さい" value={store.detailedAddress}
                                            maxLength={128}
                                            onChange={({target: {value}}) => {
                                                store.detailedAddress = value;
                                                validateStatus['detailedAddress'] = !!value ? 'success' : 'error';
                                                this.setState({store, validateStatus});
                                            }}/>
                        </Form.Item>
                    </Col>
                </Row>
            </Form>
            <div
                style={{
                    position: 'absolute',
                    right: 0,
                    bottom: 0,
                    width: '100%',
                    borderTop: '1px solid #e9e9e9',
                    padding: '10px 16px',
                    background: '#fff',
                    textAlign: 'right',
                }}
            >
                <Button onClick={() => this.onClose()} style={{marginRight: 8}}>取消</Button>
                <Button type="primary" onClick={() => this.submitStore()}>セーブ</Button>
            </div>
        </Drawer>
    }
}