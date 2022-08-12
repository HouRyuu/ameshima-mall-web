import React, {Component} from "react";
import {Affix, Button, Col, Row} from "antd";
import UrlUtil from "../../utils/UrlUtil";
import FetchUtil from "../../utils/FetchUtil";
import OrderGoodsList from "../../components/OrderGoodsList";

export default class OrderConfirmDone extends Component {

    state = {
        orderList: []
    }

    componentWillMount() {
        this.findOrderGoodsList();
    }

    findOrderGoodsList() {
        const {
            searchParam: {orderNo}
        } = new UrlUtil(window.location);
        if (orderNo) {
            FetchUtil.get({
                url: `/order/${orderNo}/goods`,
                success: ({data: orderList}) => {
                    this.setState({orderList});
                }
            })
        }
    }

    render() {
        const {orderList} = this.state;
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
                                    <span className="selected-count">{goodsCount}</span>点
                                </Col>
                                <Col span={5} style={{textAlign: 'right'}}>
                                    合計：{" "}<span className="total-price">¥{totalPrice}</span>(税込)
                                </Col>
                                <Col span={3} style={{textAlign: 'center'}}>
                                    <Button type="danger"
                                            onClick={() => {
                                            }}>支払う</Button>
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
