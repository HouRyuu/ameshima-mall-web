import React, {Component} from "react";
import {Table, Row, Col, Button} from "antd";
import "../../cart/cart.css";
import "./confirm.css";
import FetchUtil from "../../utils/FetchUtil";

export default class OrderConfirm extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        seletedAddrIndex: 0,
        showAllAddr: false,
        addressList: [{
            name: '郭女士',
            province: '广东省',
            city: '广州市',
            district: '海珠区',
            detailedAddress: '海珠南洲后滘大街一巷六号',
            phone: '15625162528',
            isDefault: 1
        }, {
            name: '郭女士',
            province: '广东省',
            city: '广州市',
            district: '海珠区',
            detailedAddress: '海珠南洲后滘大街一巷六号',
            phone: '15625162528',
            isDefault: 0
        }, {
            name: '郭女士',
            province: '广东省',
            city: '广州市',
            district: '海珠区',
            detailedAddress: '海珠南洲后滘大街一巷六号',
            phone: '15625162528',
            isDefault: 0
        }, {
            name: '郭女士',
            province: '广东省',
            city: '广州市',
            district: '海珠区',
            detailedAddress: '海珠南洲后滘大街一巷六号',
            phone: '15625162528',
            isDefault: 0
        }, {
            name: '郭女士',
            province: '广东省',
            city: '广州市',
            district: '海珠区',
            detailedAddress: '海珠南洲后滘大街一巷六号',
            phone: '15625162528',
            isDefault: 0
        }, {
            name: '郭女士',
            province: '广东省',
            city: '广州市',
            district: '海珠区',
            detailedAddress: '海珠南洲后滘大街一巷六号',
            phone: '15625162528',
            isDefault: 0
        }],
        address: {}
    }

    findAddressList() {
        FetchUtil.get({
            url: '/user/address/list',
            success: ({data: addressList}) => {
                this.setState({addressList});
            }
        })
    }

    componentWillMount() {
        this.findAddressList();
    }

    selectAddress(seletedAddrIndex) {
        this.setState({seletedAddrIndex})
    }

    render() {
        const {seletedAddrIndex, showAllAddr, addressList} = this.state;
        return (
            <div>
                <div className='cart-table'>
                    <h3 style={{fontSize: '13px', fontWeight: 'bold'}}>选择收货地址</h3>
                    <div className='address-list'
                         style={!showAllAddr ? {height: '113px'} : null}
                    >
                        {addressList.map(({
                                              name,
                                              province,
                                              city,
                                              district,
                                              detailedAddress,
                                              phone,
                                              isDefault,
                                              selected
                                          }, index) =>
                            <div className={`addr-item-wrapper ${seletedAddrIndex === index ? 'addr-selected' : ''}`}
                                 onClick={() => this.selectAddress(index)}>
                                <div className="inner-infos">
                                    <div className="addr-hd">{`${province + city + district}(${name})`}</div>
                                    <div className="addr-bd">
                                        <span>{detailedAddress}</span>
                                        <span>{phone}</span>
                                    </div>
                                    {seletedAddrIndex === index ?
                                        <a title="修改地址" className="modify-operation">修改</a> : null}
                                    {seletedAddrIndex === index ? <div className="curMarker"/> : null}
                                    {isDefault ? <div className="default-tip">默认地址</div> : null}
                                </div>
                            </div>)
                        }
                    </div>
                    <Row type="flex" align="middle" justify={"space-between"} style={{textAlign: "center"}}>
                        <Col span={3}>
                            {
                                showAllAddr ? <Button>新增地址</Button> :
                                    <Button type="link"
                                            onClick={() => this.setState({showAllAddr: true})}>展开所有地址</Button>
                            }
                        </Col>
                        <Col span={2}><Button>管理地址</Button></Col>
                    </Row>
                </div>
                <div className="cart-table">
                    <Table
                        rowKey="key"
                        columns={[
                            {
                                title: (
                                    <div className="cart-table-head">
                                        <span style={{width: "35%"}}>店铺宝贝</span>
                                        <span style={{width: "23%"}}>商品属性</span>
                                        <span style={{width: "14%", textAlign: 'center'}}>单价</span>
                                        <span style={{width: "14%", textAlign: 'center'}}>数量</span>
                                        <span style={{width: "14%", textAlign: 'center'}}>小计</span>
                                    </div>
                                ),
                                dataIndex: "goodsTable"
                            }
                        ]}
                        dataSource={[]}
                        pagination={false}
                    />
                </div>
            </div>
        );
    }
}
