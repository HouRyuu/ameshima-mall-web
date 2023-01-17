import React, {Component} from "react";
import {Affix, Button, Col, message, Row} from "antd";
import UrlUtil from "../../utils/UrlUtil";
import FetchUtil from "../../utils/FetchUtil";
import OrderGoodsList from "../../components/OrderGoodsList";
import {browserHistory} from "react-router";

export default class OrderConfirmDone extends Component {

    state = {
        orderList: [],
        paying: false
    }

    constructor(props) {
        super(props);
        const {
            searchParam: {orderNo}
        } = new UrlUtil(window.location);
        this.setState({parentOrderNo: orderNo})
    }

    componentWillMount() {
    }

    componentDidMount() {
        this.findOrderGoodsList();
    }

    findOrderGoodsList() {
        const {
            searchParam: {orderNo}
        } = new UrlUtil(window.location);
        if (orderNo) {
            FetchUtil.get({
                url: `/order/${orderNo}/goods/1`,
                success: ({data: orderList}) => {
                    this.setState({orderList});
                }
            })
        }
    }

    payOrder() {
        const {
            searchParam: {orderNo}
        } = new UrlUtil(window.location);
        FetchUtil.put({
            url: `/order/${orderNo}/pay`,
            sendBefore: () => this.setState({paying: true}),
            success: () => {
                message.info("支払い完了", () => {
                    browserHistory.push({
                        pathname: '/order/pay',
                        search: `?orderNo=${orderNo}`
                    });
                })
            },
            complete: () => this.setState({paying: false})
        })
    }

    render() {
        const {orderList, paying} = this.state;
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
            <div className="confirm-panel">
                <div className="cart-table">
                    <OrderGoodsList orderList={orderList}/>
                    <div>
                        <Affix offsetBottom={10}>
                            <Row type="flex" justify="space-between" align="middle" className="balance-row">
                                <Col span={5} offset={11} style={{textAlign: 'right'}}>
                                    商品<span className="selected-count">{goodsCount}</span>点
                                </Col>
                                <Col span={5} style={{textAlign: 'right'}}>
                                    合計：{" "}<span className="total-price">¥{totalPrice}</span>(税込)
                                </Col>
                                <Col span={3} style={{textAlign: 'center'}}>
                                    <Button type="danger" disabled={paying}
                                            onClick={() => this.payOrder()}>支払う</Button>
                                </Col>
                            </Row>
                        </Affix>
                        <div className="wonderful-end"/>
                    </div>
                </div>
            </div>
        );
    }
}
