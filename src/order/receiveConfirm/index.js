import React, {Component} from "react";
import UrlUtil from "../../utils/UrlUtil";
import FetchUtil from "../../utils/FetchUtil";
import OrderGoodsList from "../../components/OrderGoodsList";

export default class OrderReceiveConfirm extends Component {
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
                url: `/order/${orderNo}/goods/3`,
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
                    <OrderGoodsList showPay orderList={this.state.orderList} refresh={() => this.findOrderGoodsList()}/>
                </div>
            </div>
        );
    }
}
