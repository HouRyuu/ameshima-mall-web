import React, {Component} from "react";
import {Drawer, Form, Button, Col, Row, Input, Select} from 'antd';
import Region from "../../utils/Region";

const {Option} = Select;
export default class AddressForm extends Component {
    state = {
        area: [],
        cities: [],
        districts: [],
        visible: false,
        address: {},
        validateStatus: {},
        region: new Region()
    }

    componentWillReceiveProps(props) {
        const {visible, address} = props;
        this.setState({
            visible,
            address,
            validateStatus: {}
        })
        if (address.id) {
            const {region} = this.state;
            region.initRegion(region.setCityList, address.provinceCode, undefined, 2, () =>
                this.setState({})
            );
            region.initRegion(region.setDistrictList, address.cityCode, address.provinceCode, 3, () =>
                this.setState({})
            );
        }
    }

    onClose() {
        this.setState({
            visible: false,
            address: {},
            validateStatus: {}
        });
        const {close} = this.props;
        if (close) {
            close();
        }
    }

    validation() {
        const {validateStatus, address} = this.state;
        const keys = ['name', 'phone', 'provinceCode', 'cityCode', 'districtCode', 'detailedAddress'];
        let flag = true;
        keys.forEach(key => {
            validateStatus[key] = !!address[key] ? 'success' : 'error';
            if (flag) flag = !!address[key];
        })
        this.setState({validateStatus});
        return flag;
    }

    submitAddress(address) {
        if (!this.validation()) {
            return;
        }
        const {submit} = this.props;
        if (submit) {
            submit(address);
        }
    }

    render() {
        const {
            visible,
            address,
            validateStatus,
            region
        } = this.state;
        const {provinceList = [], cityList = [], districtList = []} = region;
        const {name, phone, provinceCode, cityCode, districtCode, detailedAddress} = address;
        return <Drawer
            title="????????????"
            placement="left"
            width={720}
            onClose={() => this.onClose()}
            visible={visible}
            bodyStyle={{paddingBottom: 80}}
        >
            <Form layout="vertical">
                <Row gutter={16}>
                    <Col span={12}>
                        <Form.Item label="?????????" hasFeedback validateStatus={validateStatus.name}>
                            <Input placeholder="??????????????????????????????" value={name}
                                   maxLength={32}
                                   onChange={({target: {value}}) => {
                                       address.name = value;
                                       validateStatus['name'] = !!address.name ? 'success' : 'error';
                                       this.setState({address, validateStatus});
                                   }}/>
                        </Form.Item>
                    </Col>
                    <Col span={12}>
                        <Form.Item label="?????????" hasFeedback validateStatus={validateStatus.phone}>
                            <Input placeholder="??????????????????????????????" value={phone}
                                   maxLength={16}
                                   onChange={({target: {value}}) => {
                                       if (isNaN(value)) {
                                           return;
                                       }
                                       address.phone = value.trim();
                                       validateStatus['phone'] = !!address.phone ? 'success' : 'error';
                                       this.setState({address, validateStatus});
                                   }}/>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={8}>
                        <Form.Item label="????????????" hasFeedback validateStatus={validateStatus.provinceCode}>
                            <Select placeholder="?????????????????????????????????" value={provinceCode}
                                    onChange={(value, option) => {
                                        address.provinceCode = value;
                                        address.province = option.props.children;
                                        validateStatus['provinceCode'] = !!address.provinceCode ? 'success' : 'error';
                                        address.cityCode = undefined;
                                        address.city = undefined;
                                        address.districtCode = undefined;
                                        address.district = undefined;
                                        region.initRegion(region.setCityList, value, undefined, 2, () =>
                                            this.setState({address, validateStatus})
                                        );
                                    }}>
                                {provinceList.map(({regionCode, regionName}) =>
                                    <Option key={regionCode} value={regionCode}>{regionName}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="???" hasFeedback validateStatus={validateStatus.cityCode}>
                            <Select placeholder="????????????????????????" value={cityCode}
                                    onChange={(value, option) => {
                                        address.cityCode = value;
                                        address.city = option.props.children;
                                        address.districtCode = undefined;
                                        address.district = undefined;
                                        validateStatus['cityCode'] = !!address.cityCode ? 'success' : 'error';
                                        region.initRegion(region.setDistrictList, value, provinceCode, 3, () =>
                                            this.setState({address, validateStatus})
                                        );
                                    }}>
                                {cityList.map(({regionCode, regionName}) =>
                                    <Option key={regionCode} value={regionCode}>{regionName}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                    <Col span={8}>
                        <Form.Item label="???" hasFeedback validateStatus={validateStatus.districtCode}>
                            <Select placeholder="????????????????????????" value={districtCode}
                                    onChange={(value, option) => {
                                        address.districtCode = value;
                                        address.district = option.props.children;
                                        validateStatus['districtCode'] = !!address.districtCode ? 'success' : 'error';
                                        this.setState({address, validateStatus});
                                    }}>
                                {districtList.map(({regionCode, regionName}) =>
                                    <Option key={regionCode} value={regionCode}>{regionName}</Option>)}
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>
                <Row gutter={16}>
                    <Col span={24}>
                        <Form.Item label="????????????" hasFeedback validateStatus={validateStatus.detailedAddress}>
                            <Input.TextArea rows={4} placeholder="?????????????????????????????????" value={detailedAddress}
                                            maxLength={128}
                                            onChange={({target: {value}}) => {
                                                address.detailedAddress = value;
                                                validateStatus['detailedAddress'] = !!address.detailedAddress ? 'success' : 'error';
                                                this.setState({address, validateStatus});
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
                <Button onClick={() => this.onClose()} style={{marginRight: 8}}>?????????</Button>
                <Button type="primary" onClick={() => this.submitAddress(address)}>?????????</Button>
            </div>
        </Drawer>
    }
}