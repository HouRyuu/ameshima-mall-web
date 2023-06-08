import React, {Component} from "react";
import {Drawer, Form, Button, Col, Row, Input, Select, Upload, Icon} from 'antd';
import Region from "../../utils/Region";

const {Option} = Select;
export default class StoreForm extends Component {
    state = {
        region: Region.INSTANCE
    }

    onClose() {
        const {close} = this.props;
        if (close) {
            close();
        }
    }

    render() {
        const {visible} = this.props;
        const {
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
                        <Form.Item label="店舗名" hasFeedback>
                            <Input placeholder="店舗名をご入力下さい" maxLength={32}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="会社名" hasFeedback>
                            <Input placeholder="会社名をご入力下さい" maxLength={32}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="電話番号" hasFeedback>
                            <Input placeholder="電話番号をご入力下さい" maxLength={32}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="経営ライセンス写真" hasFeedback>
                            <Upload
                                accept=".png,.jpg,.jpeg,.gif"
                                listType="picture-card"
                            >
                                <div>
                                    <Icon type="plus"/>
                                    <div>アップロード</div>
                                </div>
                            </Upload>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="都道府県" hasFeedback>
                            <Select placeholder="都道府県をお選び下さい">
                                {provinceList.map(({regionCode, regionName}) =>
                                    <Option key={regionCode} value={regionCode}>{regionName}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="市区村" hasFeedback>
                            <Select placeholder="お選び下さい">
                                {cityList.map(({regionCode, regionName}) =>
                                    <Option key={regionCode} value={regionCode}>{regionName}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="町" hasFeedback>
                            <Select placeholder="お選び下さい">
                                {districtList.map(({regionCode, regionName}) =>
                                    <Option key={regionCode} value={regionCode}>{regionName}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item label="詳細住所" hasFeedback>
                            <Input.TextArea rows={4} placeholder="詳細住所をご入力下さい"/>
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
                <Button onClick={() => this.onClose()} style={{marginRight: 8}}>取消し</Button>
                <Button type="primary">セーブ</Button>
            </div>
        </Drawer>
    }
}