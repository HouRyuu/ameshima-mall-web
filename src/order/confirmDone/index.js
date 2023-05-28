import React, {Component} from "react";
import {Affix, Button, Col, Icon, message, Row, Spin} from "antd";
import UrlUtil from "../../utils/UrlUtil";
import FetchUtil from "../../utils/FetchUtil";
import OrderGoodsList from "../../components/OrderGoodsList";
import {browserHistory} from "react-router";

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: 'https://at.alicdn.com/t/c/font_3587549_38byjo3ae9j.js',
})
export default class OrderConfirmDone extends Component {
    orderNo = new UrlUtil().searchParam.orderNo;
    state = {
        orderStateArr: [],
        orderList: [],
        paying: false,
        payWayArr: []
    }

    componentDidMount() {
        this.getPayWayCfg();
        this.findOrderGoodsList();
        this.getOrderStateCfg();
    }

    findOrderGoodsList() {
        if (this.orderNo) {
            FetchUtil.get({
                url: `/order/${this.orderNo}/goods/1`,
                success: ({data: orderList}) => {
                    this.setState({orderList});
                }
            })
        }
    }

    getPayWayCfg() {
        FetchUtil.get({
            url: '/basic/pay/way',
            success: ({data}) => this.setState({payWayArr: JSON.parse(data)})
        });
    }

    getOrderStateCfg() {
        FetchUtil.get({
            url: '/basic/order/state',
            success: ({data}) => this.setState({orderStateArr: JSON.parse(data)})
        });
    }

    showPay(payWay) {
        if ('paypay' === payWay) {
            FetchUtil.get({
                url: `/order/${this.orderNo}/0/paypay/code`,
                sendBefore: () => this.setState({paying: true}),
                success: ({data}) => {
                    if (data && data.indexOf('http') > -1) {
                        window.open(data, "Paypay", "height=820, width=820, left=360");
                        this.showPayCountDown();
                    }
                },
                error: ({errCode, errMsg}) => {
                    this.setState({paying: false});
                    if (errCode === 600) {
                        message.info(errMsg);
                        browserHistory.push({
                            pathname: '/order/pay',
                            search: `?orderNo=${this.orderNo}`
                        });
                        return;
                    }
                    message.error(errMsg)
                }
            })
        }
    }

    paypayStatus(timer) {
        FetchUtil.put({
            url: `/order/${this.orderNo}/0/paypay/status`,
            success: ({data}) => {
                if (!data) {
                    if (timer) {
                        clearInterval(timer);
                    }
                    this.setState({paying: false})
                    message.info("支払い完了")
                    browserHistory.push({
                        pathname: '/order/pay',
                        search: `?orderNo=${this.orderNo}`
                    });
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

    showPayCountDown() {
        let secondsToGo = 240;
        const timer = setInterval(() => {
            this.paypayStatus(timer);
        }, 5000);
        setTimeout(() => {
            clearInterval(timer);
        }, secondsToGo * 1000);
    }

    render() {
        const {orderStateArr, orderList, paying, payWayArr} = this.state;
        let goodsCount = 0, totalPrice = 0;
        orderList.forEach(({orderPay: {dealPrice}, logisticsGoodsList}) => {
            totalPrice += dealPrice;
            logisticsGoodsList.forEach(({goodsList}) => {
                goodsList.forEach(goods => {
                    goodsCount += goods.amount;
                });
            });
        });
        return (
            <Spin size={"large"} tip="支払い中" spinning={paying}>
                <div className="confirm-panel">
                    <div className="cart-table">
                        <OrderGoodsList orderStateArr={orderStateArr} orderList={orderList}/>
                        <div>
                            <Affix offsetBottom={10}>
                                <Row type="flex" justify="space-between" align="middle" className="balance-row">
                                    <Col span={5} offset={11} style={{textAlign: 'right'}}>
                                        商品<span className="selected-count">{goodsCount}</span>点
                                    </Col>
                                    <Col span={5} style={{textAlign: 'right'}}>
                                        合計(税込)：{" "}<span className="total-price">¥{totalPrice}</span>
                                    </Col>

                                    <Col span={3} style={{textAlign: 'center'}}>
                                        {!!orderList.length ?
                                            <Button.Group>
                                                {
                                                    payWayArr.map(way => <Button disabled={paying} shape="circle"
                                                                                 key={way}
                                                                                 onClick={() => this.showPay(way)}>
                                                        <IconFont key={way} type={`icon-${way}`}/>
                                                    </Button>)
                                                }
                                            </Button.Group> : null}
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
