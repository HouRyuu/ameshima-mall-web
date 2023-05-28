import React, {Component} from "react";
import UrlUtil from "../../utils/UrlUtil";
import FetchUtil from "../../utils/FetchUtil";
import OrderGoodsList from "../../components/OrderGoodsList";

export default class OrderPay extends Component {
    state = {
        orderList: []
    }

    componentWillMount() {
        this.findOrderGoodsList();
    }

    findOrderGoodsList() {
        const {
            searchParam: {orderNo}
        } = new UrlUtil();
        if (orderNo) {
            FetchUtil.get({
                url: `/order/${orderNo}/goods/2`,
                success: ({data: orderList}) => {
                    this.setState({orderList});
                }
            })
        }
    }

    render() {
        return (
            <div className="confirm-panel">
                <div className="cart-table">
                    <OrderGoodsList showPay orderList={this.state.orderList}/>
                </div>
            </div>
        );
    }
}
