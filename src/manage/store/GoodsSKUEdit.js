import React, {Component} from "react";
import {Button, Col, Drawer, Form, InputNumber, message, Popconfirm, Row, Select, Tooltip} from "antd";
import FetchUtil from "../../utils/FetchUtil";
import ButtonGroup from "antd/es/button/button-group";

export default class GoodsSKUEdit extends Component {
    state = {
        skuList: [{
            id: 1,
            attrs: '1,7',
            price: 702,
            marketPrice: 780,
            quantity: 100
        }, {
            id: 1,
            attrs: '1,7',
            price: 702,
            marketPrice: 780,
            quantity: 100
        }],
        attrMapList: [{
            key: 'サーイズ',
            value: [{
                id: 1,
                txtValue: '155/76A/XS',
                imgValue: null
            }]
        }, {
            key: 'カラー',
            value: [{
                id: 7,
                txtValue: '标准白-WT',
                imgValue: '//img.alicdn.com/imgextra/i2/676606897/O1CN01DiC5Ob20osDZeKb7z_!!676606897.jpg_40x40q90.jpg'
            }]
        }]
    }

    componentWillReceiveProps(nextProps, nextContext) {
        if (nextProps.visible) {
            const {goodsId} = nextProps;
            this.attrMapList(goodsId);
            this.skuList(goodsId);
        }
        return true;
    }

    attrMapList(goodsId) {
        FetchUtil.get({
            url: `/goods/attr/map/${goodsId}`,
            success: ({data: attrMapList}) => this.setState({attrMapList})
        })
    }

    skuList(goodsId) {
        FetchUtil.get({
            url: `/goods/${goodsId}/sku/list`,
            success: ({data: skuList}) => this.setState({skuList})
        })
    }

    addNewLine() {
        const {skuList, attrMapList} = this.state;
        const attrs = attrMapList.map(({value}) => value[0].id);
        skuList.push({attrs: attrs.join()});
        this.setState({skuList});
    }

    saveSKU(record) {
        record.goodsId = this.props.goodsId;
        FetchUtil.put({
            url: '/goods/sku/save',
            data: record,
            success: ({data}) => {
                const {paramList} = this.state;
                record.id = data;
                this.setState({paramList}, () => {
                    message.info("保存が完了しました。")
                });
            }
        });
    }

    deleteSKU(index, id) {
        const {skuList} = this.state;
        if (id) {
            FetchUtil.delete({
                url: `/goods/${this.props.goodsId}/sku/${id}/delete`,
                success: () => {
                    skuList.splice(index, 1);
                    this.setState({skuList}, () => {
                        message.info("削除完了です。")
                    });
                }
            });
            return;
        }
        skuList.splice(index, 1);
        this.setState({skuList});
    }

    render() {
        const {isEdit, visible, onClose} = this.props;
        const {skuList, attrMapList} = this.state;
        return <Drawer
            title="SKU"
            className="goods-sku-edit"
            placement="left"
            width={720}
            keyboard={false}
            onClose={() => onClose()}
            visible={visible}
            bodyStyle={{paddingBottom: 80}}>
            <Form layout="vertical">
                <Row gutter={8}>
                    {attrMapList.map(({key, value}, attrIndex) => {
                        return <Col key={attrIndex} span={parseInt(12 / attrMapList.length)}>
                            <Form.Item label={key}/>
                        </Col>
                    })}
                    <Col span={3}>
                        <Form.Item label='原価'/>
                    </Col>
                    <Col span={3}>
                        <Form.Item label='価格'/>
                    </Col>
                    <Col span={3}>
                        <Form.Item label='在庫'/>
                    </Col>
                    <Col span={3}>
                        <Form.Item label={<span>操作&nbsp;
                            <Tooltip title="SKUを作成" placement="bottom">
                                    <Button disabled={!isEdit} size="small" icon="plus" type="dashed"
                                            onClick={() => this.addNewLine()}/>
                                    </Tooltip></span>}/>
                    </Col>
                </Row>
                {skuList.map((skuRecord, skuIndex) => {
                    const {id, attrs, price, marketPrice, quantity} = skuRecord;
                    const attrAry = attrs ? attrs.split(',') : [];
                    return <Row key={skuIndex} gutter={8} type="flex" align="middle" style={{marginBottom:"10px"}}>
                        {attrMapList.map(({key, value}, attrIndex) => {
                            return <Col key={attrIndex} span={parseInt(12 / attrMapList.length)}>
                                <Select value={parseInt(attrAry[attrIndex])} onChange={(attrId) => {
                                    attrAry[attrIndex] = attrId;
                                    skuRecord.attrs = attrAry.join();
                                    this.setState({})
                                }}>
                                    {value.map(({id, txtValue, imgValue}) => {
                                        return <Select.Option key={id} value={id}>
                                            {txtValue}
                                        </Select.Option>
                                    })}
                                </Select>
                            </Col>
                        })}
                        <Col span={3}>
                            <InputNumber style={{width: '100%'}} value={marketPrice}
                                         onChange={(value) => {
                                             skuRecord.marketPrice = value;
                                             this.setState({})
                                         }}/>
                        </Col>
                        <Col span={3}>
                            <InputNumber style={{width: '100%'}} value={price}
                                         onChange={(value) => {
                                             skuRecord.price = value;
                                             this.setState({})
                                         }}/>
                        </Col>
                        <Col span={3}>
                            <InputNumber style={{width: '100%'}} value={quantity}
                                         onChange={(value) => {
                                             skuRecord.quantity = value;
                                             this.setState({})
                                         }}/>
                        </Col>
                        <Col span={3}>
                            <ButtonGroup>
                                <Tooltip title="保存" placement="bottom">
                                    <Button disabled={!isEdit} type="dashed" size="small" icon="save"
                                            onClick={() => this.saveSKU(skuRecord)}/>
                                </Tooltip>
                                <Tooltip title="削除" placement="bottom">
                                    <Popconfirm
                                        title="削除しますか?"
                                        onConfirm={() => this.deleteSKU(skuIndex, id)}
                                        okText="はい"
                                        cancelText="いいえ"
                                    >
                                        <Button disabled={!isEdit} type="danger" size="small" icon="delete"/>
                                    </Popconfirm>
                                </Tooltip>
                            </ButtonGroup>
                        </Col>
                    </Row>
                })}
            </Form>
        </Drawer>
    }
};