import React, {Component} from "react";
import {Table, Row, Col, Button, Empty, Popover, InputNumber, Tag, Icon} from "antd";
import "../../cart/cart.css";
import "./confirm.css";
import FetchUtil from "../../utils/FetchUtil";
import fetchUtil from "../../utils/FetchUtil";
import {Link} from "react-router";

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
        }],
        address: {},
        storeList: []
    }

    findAddressList() {
        FetchUtil.get({
            url: '/user/address/list',
            success: ({data: addressList}) => {
                this.setState({addressList, showAllAddr: addressList.length < 6});
            }
        })
    }

    componentWillMount() {
        this.findAddressList();
        this.findGoods();
    }

    selectAddress(seletedAddrIndex) {
        this.setState({seletedAddrIndex})
    }

    findGoods() {
        fetchUtil.get({
            url: '/goods/goodsBySkus',
            success: ({data}) => {
                this.setState({storeList: data})
            }
        })
    }

    updateAmount(skuId, amount, storeIndex, index) {
        const {storeList} = this.state;
        FetchUtil.put({
            url: `/goods/cacheBuySkus/${skuId}/updateAmount/${amount}`,
            success: () => {
                storeList[storeIndex].goodsList[index].amount = amount;
                this.setState({storeList});
            }
        })
    }

    renderGoods(storeList) {
        const result = [];
        if (!storeList || !storeList.length) return [];
        storeList.forEach(({storeId, storeName, goodsState, goodsList}, storeIndex) => {
            const dataSource = [];
            goodsList.map(({
                               skuId,
                               goodsId,
                               name,
                               imgUrl,
                               attrsJson,
                               price,
                               marketPrice,
                               amount,
                               quantity
                           }, index) => {
                const attrObj = JSON.parse(attrsJson);
                const attrDom = [];
                for (const attrKey in attrObj) {
                    attrDom.push(
                        <div key={attrKey}>
                            {attrKey}：{attrObj[attrKey]}
                        </div>
                    );
                }
                dataSource.push({
                    img: (
                        <Popover
                            placement="right"
                            content={<img alt="" width="320" src={imgUrl}/>}
                        >
                            <img alt="" className="cart-goods-img" src={imgUrl}/>
                        </Popover>
                    ),
                    name: goodsState ? (
                        <span style={{wordWrap: 'break-word', wordBreak: 'break-word'}}>name</span>
                    ) : (
                        <Link style={{wordWrap: 'break-word', wordBreak: 'break-word'}} to={`/goods?id=${goodsId}`}
                              onlyActiveOnIndex>{name}</Link>
                    ),
                    attrs: (
                        <div className="cart-attrs-content">
                            {attrDom.map(attr => attr)}
                            <div>库存{quantity}件</div>
                        </div>
                    ),
                    price:
                        price === marketPrice ? (
                            <span className="cart-price-content">￥{price}</span>
                        ) : (
                            <div className="cart-price-content">
                                <span>￥{marketPrice}</span>
                                <span>￥{price}</span>
                            </div>
                        ),
                    amount: goodsState ? (
                        amount
                    ) : (
                        <InputNumber bordered={false} min={1} max={quantity} defaultValue={amount}
                                     onChange={(value) => this.updateAmount(skuId, value, storeIndex, index)}/>
                    ),
                    money: <span className="cart-sum">￥{price * amount}</span>
                });
            });
            result.push({
                key: `${storeId}-${goodsState}`,
                goodsTable: (
                    <Table
                        rowKey="id"
                        className="cart-goods-table"
                        title={() => (
                            <div className="shop-info">
                                {goodsState === 0 ? null : (
                                    <Tag>已失效</Tag>
                                )}
                                <Icon type="shop" style={{margin: "0 8px", fontSize: 16}}/>
                                <span style={{fontSize: 13}}>
                  店铺：<Link to={`/store?id=${storeId}`} onlyActiveOnIndex>{storeName}</Link>
                </span>
                            </div>
                        )}
                        showHeader={false}
                        columns={[
                            {dataIndex: "img", className: "buy-list-1"},
                            {dataIndex: "name", className: "buy-list-2"},
                            {dataIndex: "attrs", className: "buy-list-3"},
                            {dataIndex: "price", className: "buy-list-4"},
                            {dataIndex: "amount", className: "buy-list-5"},
                            {dataIndex: "money"},
                        ]}
                        dataSource={dataSource}
                        pagination={false}
                    />
                )
            });
        });
        return result;
    }

    render() {
        const {seletedAddrIndex, showAllAddr, addressList, storeList} = this.state;
        return (
            <div className="confirm-panel">
                <div className='cart-table'>
                    <h3 style={{fontSize: '13px', fontWeight: 'bold'}}>选择收货地址</h3>
                    {addressList.length ?
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
                                <div
                                    className={`addr-item-wrapper ${seletedAddrIndex === index ? 'addr-selected' : ''}`}
                                    onClick={() => this.selectAddress(index)}>
                                    <div className="inner-infos">
                                        <div className="addr-hd">{`${province + city + district}(${name})`}</div>
                                        <div className="addr-bd">
                                            <span>{detailedAddress}</span>
                                            <span>{phone}</span>
                                        </div>
                                        {seletedAddrIndex === index ?
                                            <a title="配送先を修正" className="modify-operation">修正</a> : null}
                                        {seletedAddrIndex === index ? <div className="curMarker"/> : null}
                                        {isDefault ? <div className="default-tip">デフォルト</div> : null}
                                    </div>
                                </div>)}
                        </div> :
                        <Empty description="配送先を配置していません"/>
                    }
                    <Row type="flex" align="middle" justify={"space-between"} style={{textAlign: "center"}}>
                        <Col span={3}>
                            {
                                !addressList.length || showAllAddr ? <Button>配送先をクリエート</Button> :
                                    <Button type="link"
                                            onClick={() => this.setState({showAllAddr: true})}>配送先を広げる</Button>
                            }
                        </Col>
                        <Col span={2}><Button>配送先を管理</Button></Col>
                    </Row>
                </div>
                <div className="cart-table">
                    <Table
                        rowKey="key"
                        columns={[
                            {
                                title: (
                                    <div className="cart-table-head">
                                        <span style={{width: "40%"}}>お宝物</span>
                                        <span style={{width: "27%"}}>品物属性</span>
                                        <span style={{width: "12%"}}>単価</span>
                                        <span style={{width: "15%"}}>数量</span>
                                        <span>金額</span>
                                    </div>
                                ),
                                dataIndex: "goodsTable"
                            }
                        ]}
                        dataSource={this.renderGoods(storeList)}
                        pagination={false}
                    />
                </div>
            </div>
        );
    }
}
