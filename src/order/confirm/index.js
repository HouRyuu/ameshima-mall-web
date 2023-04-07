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
import FetchUtil from "../../utils/FetchUtil";
import {browserHistory, Link} from "react-router";
import AddressForm from "../../manage/address/addressForm";

export default class OrderConfirm extends Component {

    state = {
        seletedAddrIndex: -1,
        showAllAddr: false,
        addressList: [],
        editAddr: {},
        addrFormFlag: false,
        storeList: [],
        freightMap: {},
        totalPrice: 0,
        orderTag: false,
        orderSubmitting: false
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
        FetchUtil.post({
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
            sendBefore: () => this.setState({orderSubmitting: true}),
            success: ({data: orderNo}) => {
                if (orderNo) {
                    const waitOrder = setInterval(() => {
                        FetchUtil.get({
                            url: `/order/created/${orderNo}`,
                            success: ({data: state}) => {
                                if (state) {
                                    this.setState({orderSubmitting: false}, () => {
                                        browserHistory.push({
                                            pathname: '/order/confirmDone',
                                            search: `?orderNo=${orderNo}`
                                        });
                                        clearInterval(waitOrder);
                                    })
                                }
                            },
                            error: ({errMsg}) => {
                                this.setState({orderSubmitting: false})
                                message.error(errMsg);
                                clearInterval(waitOrder);
                            }
                        })
                    }, 1000);
                }
            },
            error: ({errMsg}) => {
                message.error(errMsg);
                this.setState({orderSubmitting: false})
            }
        })
    }

    renderGoods(storeList) {
        const result = [];
        if (!storeList || !storeList.length) return [];
        let skuFreight;
        const {freightMap, seletedAddrIndex, addressList} = this.state;
        if (freightMap && addressList.length && seletedAddrIndex > -1) {
            skuFreight = freightMap[addressList[seletedAddrIndex].cityCode];
        }
        storeList.forEach(({storeId, storeName, goodsState, goodsList}) => {
            const dataSource = [];
            goodsList.forEach(({
                                   skuId,
                                   goodsId,
                                   name,
                                   imgUrl,
                                   attrsJson,
                                   price,
                                   marketPrice,
                                   amount,
                                   quantity
                               }) => {
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
                            <div>在庫{quantity}点</div>
                        </div>
                    ),
                    price:
                        price === marketPrice ? (
                            <span className="cart-price-content">¥{price}</span>
                        ) : (
                            <div className="cart-price-content">
                                <span>¥{price}</span>
                                <span>¥{marketPrice}</span>
                            </div>
                        ),
                    amount: amount,
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

    openAddrEdit(editAddr) {
        this.setState({addrFormFlag: true, editAddr});
    }

    saveAddress(address) {
        FetchUtil.put({
            url: '/user/address/save',
            data: address,
            success: ({data}) => {
                message.info('セーブ完了^_^');
                const {storeList, addressList, seletedAddrIndex} = this.state;
                if (!address.id) {
                    address.id = data;
                    address.isDefault = addressList.length === 0 ? 1 : 0;
                    addressList.push(address);
                } else {
                    addressList[seletedAddrIndex] = address;
                }
                this.findFreight(address.cityCode)
                this.setState({
                    addressList,
                    seletedAddrIndex: addressList.length - 1,
                    addrFormFlag: false,
                    orderTag: storeList && storeList.length
                });
            }
        })
    }

    render() {
        const {
            seletedAddrIndex,
            showAllAddr,
            addressList,
            editAddr,
            addrFormFlag,
            storeList,
            totalPrice,
            orderTag,
            orderSubmitting
        } = this.state;
        let goodsCount = 0; // 选中SKU数量
        if (storeList.length) {
            storeList.forEach(store => {
                store.goodsList.forEach(goods => {
                    goodsCount += goods.amount;
                })
            })
        }
        return (
            <Spin size={"large"} tip="注文中" spinning={orderSubmitting}>
                <AddressForm
                    visible={addrFormFlag}
                    address={editAddr}
                    submit={(newAddress) => this.saveAddress(newAddress)}
                    close={() => this.setState({addrFormFlag: false})}/>
                <div className="confirm-panel">
                    <div className='cart-table'>
                        <h3 style={{margin: '10px', fontWeight: 'bold'}}>お届け住所</h3>
                        {addressList.length ?
                            <div className='address-list'
                                 style={!showAllAddr ? {height: '113px'} : null}>
                                {addressList.map((item, index) => {
                                    const {
                                        name,
                                        province,
                                        city,
                                        cityCode,
                                        district,
                                        detailedAddress,
                                        phone,
                                        isDefault
                                    } = item;
                                    return <div key={index}
                                        className={`addr-item-wrapper ${seletedAddrIndex === index ? 'addr-selected' : ''}`}
                                        onClick={() => this.selectAddress(cityCode, index)}>
                                        <div className="inner-infos">
                                            <div className="addr-hd">{`${province + city + district}(${name})`}</div>
                                            <div className="addr-bd">
                                                <span>{detailedAddress}</span>
                                                <span>{phone}</span>
                                            </div>
                                            {seletedAddrIndex === index ?
                                                <Link title="配送先を修正" onClick={() => this.openAddrEdit(item)}
                                                      className="modify-operation" onlyActiveOnIndex>修正</Link> : null}
                                            {seletedAddrIndex === index ? <div className="curMarker"/> : null}
                                            {isDefault ? <div className="default-tip">デフォルト</div> : null}
                                        </div>
                                    </div>
                                })}
                            </div> :
                            <Empty description="配送先を配置していません"/>
                        }
                        <Row>
                            <Col span={3} offset={21}>
                                {
                                    !addressList.length || showAllAddr ?
                                        <Button type="link" onClick={() => this.openAddrEdit({})}>配送先を追加</Button> :
                                        <Button type="link"
                                                onClick={() => this.setState({showAllAddr: true})}>配送先を展示</Button>
                                }
                            </Col>
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
                                            <span>小計</span>
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
                                        商品<span className="selected-count">{goodsCount}</span>点
                                    </Col>
                                    {
                                        orderTag ? <Col span={5} style={{textAlign: 'right'}}>
                                            合計：{" "}<span className="total-price">¥{totalPrice}</span>(税込)
                                        </Col> : null
                                    }

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
