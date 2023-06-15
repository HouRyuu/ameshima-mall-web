import React, {Component} from "react";
import {
    Button,
    Divider,
    Empty,
    Icon,
    Input,
    message,
    Popconfirm,
    Popover,
    Select,
    Spin,
    Table,
    Tag,
    Tooltip
} from "antd";
import {browserHistory, Link} from "react-router";
import FetchUtil from "../utils/FetchUtil";
import UrlUtil from "../utils/UrlUtil";


const IconFont = Icon.createFromIconfontCN({
    scriptUrl: 'https://at.alicdn.com/t/c/font_3587549_38byjo3ae9j.js',
})
export default class OrderGoodsList extends Component {

    state = {
        orderStateArr: [],
        payWayArr: [],
        logisticsStateArr: [],
        orderList: [],
        paying: false,
        showDeliveryForm: false,
        deliveryList: [],
        delivery: {}
    }

    componentDidMount() {
        this.getPayWayCfg();
        this.getLogisticsStateCfg();
        this.deliveryList();
    }

    componentWillReceiveProps(nextProps, nextContext) {
        const {orderStateArr, orderList} = nextProps;
        if (orderStateArr) {
            this.setState({orderStateArr, orderList})
        } else {
            this.getOrderStateCfg();
            this.setState({orderList})
        }
    }

    getOrderStateCfg() {
        FetchUtil.get({
            url: '/basic/order/state',
            success: ({data}) => this.setState({orderStateArr: JSON.parse(data)})
        });
    }

    getPayWayCfg() {
        FetchUtil.get({
            url: '/basic/pay/way',
            success: ({data}) => this.setState({payWayArr: JSON.parse(data)})
        });
    }

    getLogisticsStateCfg() {
        FetchUtil.get({
            url: '/basic/logistics/state',
            success: ({data}) => this.setState({logisticsStateArr: JSON.parse(data)})
        });
    }

    deliveryList() {
        FetchUtil.get({
            url: '/basic/delivery/trader',
            success: ({data}) => this.setState({deliveryList: JSON.parse(data)})
        });
    }

    showPay(orderNo, payWay) {
        const {refresh} = this.props;
        if ('paypay' === payWay) {
            FetchUtil.get({
                url: `/order/0/${orderNo}/paypay/code`,
                sendBefore: () => this.setState({paying: true}),
                success: ({data}) => {
                    if (data && data.indexOf('http') > -1) {
                        window.open(data, "Paypay", "height=820, width=820, left=360");
                        this.showPayCountDown(orderNo);
                    }
                },
                error: ({errCode, errMsg}) => {
                    this.setState({paying: false});
                    if (errCode === 600) {
                        message.info(errMsg);
                        if (refresh) {
                            refresh();
                        }
                        return;
                    }
                    message.error(errMsg)
                }
            })
        }
    }

    showPayCountDown(orderNo) {
        let secondsToGo = 240;
        const timer = setInterval(() => {
            this.paypayStatus(orderNo, timer);
        }, 5000);
        setTimeout(() => {
            clearInterval(timer);
        }, secondsToGo * 1000);
    }

    paypayStatus(orderNo, timer) {
        FetchUtil.put({
            url: `/order/0/${orderNo}/paypay/status`,
            success: ({data}) => {
                if (!data) {
                    if (timer) {
                        clearInterval(timer);
                    }
                    this.setState({paying: false})
                    this.props.refresh();
                    return;
                }
                if (!!data && 'CREATED' !== data) {
                    if (timer) {
                        clearInterval(timer);
                    }
                    this.setState({paying: false})
                    message.error('支払が失敗してしまいました😔')
                }
            },
            error: ({errMsg}) => {
                if (timer) {
                    clearInterval(timer);
                }
                this.setState({paying: false})
                message.error(errMsg)
            }
        })
    }

    clickDeliver(orderNo) {
        const {delivery} = this.state;
        if (delivery.orderNo === orderNo) { // 配送フォームをサブミット
            FetchUtil.put({
                url: '/order/delivery',
                data: delivery,
                success: () => {
                    this.setState({delivery: {}})
                    message.info("出荷完了")
                    if (this.props.refresh) {
                        this.props.refresh();
                    }
                }
            })
        } else {　// 配送フォームを展示
            this.setState({delivery: {orderNo}});
        }
    }

    changeDelivery(attrName, value) {
        const {delivery} = this.state;
        delivery[attrName] = value;
        this.setState({delivery});
    }

    renderGoods() {
        const {showPay, storeFlag} = this.props;
        const {
            orderStateArr,
            payWayArr,
            logisticsStateArr,
            orderList,
            delivery: {orderNo: deOrderNo, logisticsCompany: dLogisticsCompany, trackingNo: dTrackingNo},
            deliveryList
        } = this.state;
        if (!orderList || !orderList.length || !orderStateArr.length) {
            return [];
        }
        if (!showPay) {
            payWayArr.slice(0, payWayArr.length);
        }
        const result = [];
        orderList.forEach(({
                               orderNo,
                               storeId,
                               storeName,
                               orderState,
                               logisticsGoodsList,
                               orderPay: {payNo, dealPrice, payWay}
                           }) => {
            const dataSource = [];
            const orderStateStr = orderStateArr[orderState];
            let doDom = (<div style={{float: "right"}}>
                {
                    orderState === 1 ? <Tooltip title='支払う方法をお選び下さい'><Button.Group>
                        {
                            payWayArr.map(way => <Button shape="circle" key={way}
                                                         onClick={() => this.showPay(orderNo, way)}>
                                <IconFont key={way} type={`icon-${way}`}/>
                            </Button>)
                        }
                    </Button.Group></Tooltip> : orderState === 3 && !storeFlag ? <Popconfirm
                        title="該当注文の商品は全て届きましたか？"
                        icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}
                        onConfirm={() => this.receiveConfirm(orderNo)}
                        okText="はい"
                        cancelText="いいえ"
                    >
                        <Button>
                            <Icon type='file-protect'/>
                        </Button>
                    </Popconfirm> : orderState === 2 && storeFlag ?
                        <Tooltip title='出荷'>
                            <Button onClick={() => this.clickDeliver(orderNo)} icon='car'/>
                        </Tooltip> : null
                }
                {/*{*/}
                {/*    0 < orderState && orderState < 4 ? <Popconfirm*/}
                {/*        title="注文をキャンセルしますか"*/}
                {/*        icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}*/}
                {/*        onConfirm={null}*/}
                {/*        okText="はい"*/}
                {/*        cancelText="いいえ"*/}
                {/*    >*/}
                {/*        <Button style={{marginLeft: '10px'}} type='danger' ghost>*/}
                {/*            <Icon type='delete' theme='filled'/>*/}
                {/*        </Button>*/}
                {/*    </Popconfirm> : null*/}
                {/*}*/}

            </div>);
            let totalFreight = 0;

            logisticsGoodsList.forEach(({
                                            goodsList,
                                            orderLogistics: {
                                                goodsLocation,
                                                targetAddress,
                                                trackingNo,
                                                logisticsState,
                                                logisticsCompany
                                            }
                                        }) => {
                const {
                    name,
                    phone,
                    province,
                    city,
                    district,
                    detailedAddress
                } = JSON.parse(targetAddress)
                goodsList.forEach(({
                                       goodsId,
                                       skuId,
                                       name: goodsName,
                                       imgUrl,
                                       attrsJson,
                                       price,
                                       marketPrice,
                                       amount,
                                       freight,
                                       state
                                   }) => {
                    totalFreight += freight;
                    const attrObj = JSON.parse(attrsJson);
                    const attrDom = [];
                    for (const attrKey in attrObj) {
                        attrDom.push(
                            <div key={attrKey}>
                                {attrKey}：{attrObj[attrKey]}
                            </div>
                        );
                    }
                    let stateDom = (<Tooltip placement="left" title={
                        <div>
                            <div>
                                <Divider style={{color: "#fff"}}>届け先住所</Divider>
                                <p>{name}</p>
                                <p>{`${province} ${city} ${district}`}</p>
                                <p>{detailedAddress}</p>
                                <p>{phone}</p>
                            </div>
                            {
                                orderState !== 1 ? <div>
                                    <Divider style={{color: "#fff"}}>お支払い情報</Divider>
                                    <p>支払う方法：{payWayArr[payWay]}</p>
                                    <p>請求番号：{payNo}</p>
                                    <Divider style={{color: "#fff"}}>発送の詳細</Divider>
                                    <p>倉庫所在地：{goodsLocation}</p>
                                    <p>状態：{logisticsStateArr[logisticsState]}</p>
                                    {logisticsState ? <>
                                        <p>配送業者：{deliveryList[logisticsCompany]}</p>
                                        <p>配送番号：{trackingNo}</p>
                                    </> : null}
                                </div> : null
                            }
                        </div>
                    }>
                        <Tag color="blue">{orderStateStr}</Tag>
                    </Tooltip>);
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
                        goodsCount: goodsList.length,
                        goodsName: (
                            <div>
                                <span style={{wordWrap: 'break-word', wordBreak: 'break-word'}}>{goodsName}</span>
                                <div className="cart-attrs-content">
                                    {attrDom.map(attr => attr)}
                                </div>
                            </div>
                        ),
                        price: (
                            <div className="cart-price-content">
                                <span>¥{price}</span>
                                {
                                    price !== marketPrice ? <span>¥{marketPrice}</span> : null
                                }
                            </div>
                        ),
                        amount: amount,
                        goodsId: (
                            state === 4 ? <Button.Group>
                                <Tooltip title="コメント">
                                    <Link to={`/goods?id=${goodsId}&skuId=${skuId}&orderNo=${orderNo}`}
                                          onlyActiveOnIndex>
                                        <Button type='link' icon="highlight"/>
                                    </Link>
                                </Tooltip>
                                <Tooltip title="返品">
                                    <Button type='link' icon="rollback"/>
                                </Tooltip>
                            </Button.Group> : null

                        ),
                        money: <p className="cart-sum">¥{dealPrice}</p>,
                        state: (<div>{stateDom}</div>),
                    });
                });

            });
            result.push({
                key: `${orderNo}`,
                goodsTable: (
                    <Table
                        rowKey="id"
                        className="cart-goods-table"
                        title={() => (
                            <div className="shop-info">
                                <div>
                                    <Icon type="shop" style={{margin: "0 8px", fontSize: 16}}/>
                                    <span style={{fontSize: 13}}>
                                            <Link to={`/store?id=${storeId}`} onlyActiveOnIndex>{storeName}</Link>
                                        </span>
                                    <span style={{fontSize: 13}}> 注文番号：{orderNo}</span>
                                </div>
                                {
                                    orderNo === deOrderNo ? <div>
                                        <Select
                                            style={{width: 114}}
                                            value={dLogisticsCompany}
                                            placeholder="配送業者"
                                            onChange={(lValue) => this.changeDelivery('logisticsCompany', lValue)}>
                                            {deliveryList.map((deliveryTrader, dIndex) =>
                                                <Select.Option key={dIndex}
                                                               value={dIndex}>{deliveryTrader}</Select.Option>)}
                                        </Select>
                                        <Input
                                            style={{width: 320, marginLeft: 20}}
                                            placeholder="トラッキングID"
                                            maxLength={32}
                                            value={dTrackingNo}
                                            onChange={({target: {value: tValue}}) => this.changeDelivery('trackingNo', tValue)}/>
                                    </div> : null
                                }
                                {doDom}
                            </div>
                        )}
                        showHeader={false}
                        columns={[
                            {dataIndex: "img", width: "9%"},
                            {dataIndex: "goodsName", width: "35%"},
                            {dataIndex: "price", width: "15%"},
                            {dataIndex: "amount", width: "13%"},
                            {dataIndex: "goodsId", width: "18%"},
                            {
                                dataIndex: "money",
                                width: "13%",
                                className: "verticalAlignCenter",
                                render: (value, row, index) => {
                                    return {
                                        children: <div>{value}<p>(送料：¥{totalFreight})</p></div>,
                                        props: {
                                            rowSpan: !index ? row.goodsCount : 0
                                        },
                                    };
                                }
                            },
                            {
                                dataIndex: "state",
                                className: "verticalAlignCenter",
                                render: (value, row, index) => {
                                    return {
                                        children: value,
                                        props: {
                                            rowSpan: !index ? row.goodsCount : 0
                                        },
                                    };
                                }
                            }
                        ]}
                        dataSource={dataSource}
                        pagination={false}
                    />
                )
            });
        });
        return result;
    }

    receiveConfirm(orderID) {
        FetchUtil.put({
            url: `/order/${orderID}/receive/confirm`,
            success: () => {
                const {
                    searchParam: {orderNo}
                } = new UrlUtil();
                if (orderNo) {
                    browserHistory.push({
                        pathname: '/order/comment',
                        search: `?orderNo=${orderNo}`
                    });
                } else if (this.props.refresh) {
                    this.props.refresh();
                }
            }
        })
        return undefined;
    }

    render() {
        const {paying} = this.state;
        return <Spin size={"large"} tip="支払い中" spinning={paying}>
            <Table rowKey="key"
                   columns={[
                       {
                           title: (
                               <div className="cart-table-head">
                                   <span style={{width: "42%"}}>お宝物</span>
                                   <span style={{width: "13%"}}>単価</span>
                                   <span style={{width: "13%"}}>数量</span>
                                   <span style={{width: "15%"}}>単品操作</span>
                                   <span style={{width: "10%"}}>小計</span>
                                   <span>状態</span>
                               </div>
                           ),
                           dataIndex: "goodsTable"
                       }
                   ]}
                   dataSource={this.renderGoods()}
                   pagination={false}
                   locale={{emptyText: <Empty description='何もありません'/>}}
            />
        </Spin>
    }

}