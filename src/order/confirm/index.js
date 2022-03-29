import React, {Component} from "react";
import {
    Table,
    Row,
    Col,
    Button,
    Empty,
    Popover,
    Tag,
    Icon,
    Affix, Spin, message
} from "antd";
import "../../cart/cart.css";
import "./confirm.css";
import FetchUtil from "../../utils/FetchUtil";
import fetchUtil from "../../utils/FetchUtil";
import {browserHistory, Link} from "react-router";

export default class OrderConfirm extends Component {
    constructor(props) {
        super(props);
    }

    state = {
        seletedAddrIndex: -1,
        showAllAddr: false,
        addressList: [],
        storeList: [],
        freightMap: {},
        totalPrice: 0,
        orderTag: false
    }

    findAddressList() {
        FetchUtil.get({
            url: '/user/address/list',
            success: ({data: addressList}) => {
                this.setState({addressList, seletedAddrIndex: 0, showAllAddr: addressList.length < 6}, () => {
                    if (addressList.length && this.state.storeList.length) {
                        this.setState({orderTag: true});
                        this.findFreight(addressList[0].cityCode);
                    }
                });
            }
        })
    }

    componentWillMount() {
        this.findAddressList();
        this.findGoods();
    }

    selectAddress(cityCode, seletedAddrIndex) {
        this.setState({seletedAddrIndex});
        this.findFreight(cityCode);
    }

    findGoods() {
        fetchUtil.post({
            url: '/goods/goodsBySkus',
            data: {},
            success: ({data}) => {
                this.setState({storeList: data}, () => {
                    if (data.length && this.state.addressList.length) {
                        this.setState({orderTag: true});
                        this.findFreight(this.state.addressList[0].cityCode);
                    }
                });
            }
        })
    }

    findFreight(cityCode) {
        const {freightMap, storeList} = this.state;
        if (!storeList.length) {
            return;
        }
        const goodsIds = [];
        let totalPrice = 0;
        storeList.forEach(({goodsList}) => {
            goodsList.forEach(({goodsId, price, amount}) => {
                goodsIds.push(goodsId);
                totalPrice += price * amount;
            });
        })
        if (freightMap[cityCode]) {
            for (let goodsId in freightMap[cityCode]) {
                totalPrice += freightMap[cityCode][goodsId];
            }
            this.setState({totalPrice});
            return;
        }
        FetchUtil.post({
            url: `/goods/${cityCode}/freight`,
            data: goodsIds,
            success: ({data}) => {
                for (let goodsId in data) {
                    totalPrice += data[goodsId];
                }
                freightMap[cityCode] = data;
                this.setState({totalPrice, freightMap});
            }
        })
    }

    order() {
        const {seletedAddrIndex, addressList} = this.state;
        const address = addressList[seletedAddrIndex]
        if (!address) {
            return;
        }
        FetchUtil.post({
            url: `/order/create/${address.cityCode}`,
            data: {address: JSON.stringify(address)},
            sendBefore: () => this.setState({orderTag: false}),
            success: ({data}) => {
                if (data) {
                    const waitOrder = setInterval(() => {
                        FetchUtil.get({
                            url: `/order/created/${data}`,
                            success: ({data: state}) => {
                                if (state) {
                                    this.setState({orderTag: false}, () => {
                                        browserHistory.push({
                                            pathname: '/order/confirmDone',
                                            search: `?orderNo=${data}`
                                        });
                                        clearInterval(waitOrder);
                                    })
                                }
                            },
                            error: ({errMsg}) => {
                                this.setState({orderTag: true})
                                message.error(errMsg);
                                clearInterval(waitOrder);
                            }
                        })
                    }, 1000);
                }
            },
            error: ({errMsg}) => {
                message.error(errMsg);
                this.setState({orderTag: true})
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
        let skuFreight;
        const {freightMap, seletedAddrIndex, addressList} = this.state;
        if (freightMap && seletedAddrIndex > -1) {
            skuFreight = freightMap[addressList[seletedAddrIndex].cityCode];
        }
        storeList.forEach(({storeId, storeName, goodsState, goodsList}/*, storeIndex*/) => {
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
                           }/*, index*/) => {
                const freight = skuFreight ? skuFreight[goodsId] ? skuFreight[goodsId] : 0 : 0;
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
                    key: skuId,
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
                            <div>在庫{quantity}</div>
                        </div>
                    ),
                    price:
                        price === marketPrice ? (
                            <span className="cart-price-content">¥{price}</span>
                        ) : (
                            <div className="cart-price-content">
                                <span>¥{marketPrice}</span>
                                <span>¥{price}</span>
                            </div>
                        ),
                    amount: amount/*goodsState ? (
                        amount
                    ) : (
                        <InputNumber bordered={false} min={1} max={quantity} defaultValue={amount}
                                     onChange={(value) => this.updateAmount(skuId, value, storeIndex, index)}/>
                    )*/,
                    money: <span className="cart-sum">¥{price * amount}<br/>送料：¥{freight}</span>
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
                                    <Tag>無効</Tag>
                                )}
                                <Icon type="shop" style={{margin: "0 8px", fontSize: 16}}/>
                                <span style={{fontSize: 13}}>
                                    <Link to={`/store?id=${storeId}`} onlyActiveOnIndex>{storeName}</Link>
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
        const {seletedAddrIndex, showAllAddr, addressList, storeList, totalPrice, orderTag} = this.state;
        let goodsCount = 0; // 选中SKU数量
        if (storeList.length) {
            storeList.forEach(store => {
                store.goodsList.forEach(goods => {
                    goodsCount += goods.amount;
                })
            })
        }
        return (
            <Spin size={"large"} tip="注文中" spinning={!orderTag}>
                <div className="confirm-panel">
                    <div className='cart-table'>
                        <h3 style={{fontSize: '13px', fontWeight: 'bold'}}>配送先を選ぶ</h3>
                        {addressList.length ?
                            <div className='address-list'
                                 style={!showAllAddr ? {height: '113px'} : null}
                            >

                                {addressList.map(({
                                                      id,
                                                      name,
                                                      province,
                                                      city,
                                                      cityCode,
                                                      district,
                                                      detailedAddress,
                                                      phone,
                                                      isDefault,
                                                      selected
                                                  }, index) =>
                                    <div
                                        className={`addr-item-wrapper ${seletedAddrIndex === index ? 'addr-selected' : ''}`}
                                        onClick={() => this.selectAddress(cityCode, index)}>
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
                            locale={{emptyText: <Empty description='何もありません'/>}}
                        />
                        <div>
                            <Affix offsetBottom={10}>
                                <Row type="flex" justify="space-between" align="middle" className="balance-row">
                                    <Col span={5} offset={11} style={{textAlign: 'right'}}>
                                        <span className="selected-count">{goodsCount}</span>個の商品
                                    </Col>
                                    <Col span={5} style={{textAlign: 'right'}}>
                                        小計：{" "}<span className="total-price">¥{totalPrice}</span>(税込)
                                    </Col>
                                    <Col span={3} style={{textAlign: 'center'}}>
                                        <Button type="danger" disabled={!orderTag}
                                                onClick={() => this.order()}>レジに進む</Button>
                                    </Col>
                                </Row>
                            </Affix>
                            <div className="wonderful-end"/>
                        </div>
                    </div>
                </div>
            </Spin>
        );
    }
}
