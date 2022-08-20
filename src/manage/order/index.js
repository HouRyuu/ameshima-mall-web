import React, {Component} from "react";
import {Row, Col, Input, Select, DatePicker, Button, Pagination} from "antd";
import locale from 'antd/es/date-picker/locale/ja_JP.js';
import moment from "moment";
import 'moment/locale/ja'
import OrderGoodsList from "../../components/OrderGoodsList";
import FetchUtil from "../../utils/FetchUtil";
import "../../cart/cart.css";
import "../../order/confirm/confirm.css";

moment.locale("ja")
const {Option} = Select;
const {RangePicker} = DatePicker;
export default class Order extends Component {
    state = {
        orderStateArr: [],
        condition: {
            pageIndex: 1,
            pageSize: 10
        },
        querying: false,
        orderPage: {}
    }

    componentWillMount() {
        this.orderPage(1);
        this.getOrderStateCfg();
    }

    getOrderStateCfg() {
        FetchUtil.get({
            url: '/basic/order/state',
            success: ({data}) => this.setState({orderStateArr: JSON.parse(data)})
        });
    }

    orderPage(pageIndex) {
        const {condition} = this.state;
        condition.pageIndex = pageIndex;
        FetchUtil.post({
            url: '/order/page',
            data: condition,
            success: ({data: orderPage}) => this.setState({condition, orderPage})
        })
    }

    updateCondition(key, value) {
        const {condition} = this.state;
        if (key instanceof Array) {
            key.forEach((attr, index) => condition[attr] = value[index]);
        } else {
            condition[key] = value;
        }
        this.setState({condition});
    }

    render() {
        const {
            orderStateArr,
            condition: {pageIndex, pageSize, goodsName, orderState, startDate, endDate},
            querying,
            orderPage: {total, content: orderList}
        } = this.state;
        console.log(pageIndex, pageSize, total)
        return <main>
            <Row style={{margin: "10px 0 20px 0"}}>
                <Col span={4} offset={1}><Input placeholder="商品名" allowClear value={goodsName}
                                                onChange={e => this.updateCondition('goodsName', e.target.value)}/></Col>
                <Col span={4} offset={2}>
                    <Select placeholder="注文状態" allowClear value={orderState} style={{width: "100%"}}
                            onChange={value => this.updateCondition('orderState', value)}>
                        {
                            orderStateArr.map((item, index) => <Option key={index} value={index}>{item}</Option>)
                        }
                    </Select>
                </Col>
                <Col span={8} offset={2}>
                    <RangePicker
                        locale={locale}
                        disabledDate={current => current > moment().endOf('day')}
                        format='YYYY/MM/DD'
                        value={startDate ? [moment(startDate), moment(endDate)] : null}
                        onChange={dates => this.updateCondition(['startDate', 'endDate'], dates[0] ? [dates[0].hour(0).minute(0).second(0).millisecond(0).valueOf(), dates[1].hour(23).minute(59).second(59).millisecond(999).valueOf()] : [null, null])
                        }/>
                </Col>
                <Col span={3} style={{textAlign: "center"}}><Button type='primary' loading={querying}
                                                                    onClick={() => this.orderPage(pageIndex)}>検索</Button></Col>
            </Row>
            <div className="cart-warp confirm-panel">
                <div className="cart-table">
                    <OrderGoodsList orderStateArr={orderStateArr} orderList={orderList}
                                    call={() => this.orderPage(pageIndex)}/>
                    <Pagination
                        style={{textAlign: 'right', marginTop: '12px'}}
                        pageSize={pageSize}
                        pageIndex={pageIndex}
                        total={total}
                        onChange={pageIndex => this.orderPage(pageIndex)}
                    />
                </div>
            </div>

        </main>;
    }
}