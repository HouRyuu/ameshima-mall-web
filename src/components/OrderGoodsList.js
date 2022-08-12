import React, {Component} from "react";
import {Button, Empty, Icon, Popover, Table, Tooltip} from "antd";
import {Link} from "react-router";
import FetchUtil from "../utils/FetchUtil";

export default class OrderGoodsList extends Component {

    state = {
        orderStateArr: [],
        payWayArr: []
    }

    componentWillMount() {
        this.getOrderStateCfg();
        this.getPayWayCfg();
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

    renderGoods() {
        const {orderList} = this.props;
        const {orderStateArr, payWayArr} = this.state;
        if (!orderList || !orderList.length || !orderStateArr.length || !payWayArr.length) {
            return [];
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
            logisticsGoodsList.forEach(({
                                        goodsList,
                                        orderLogistics: {
                                            targetAddress
                                        }
                                    }) => {
                const {
                    name,
                    phone,
                    province,
                    city,
                    district,
                    detailedAddress,
                    trackingNo
                } = JSON.parse(targetAddress)
                goodsList.forEach(({
                                   skuId,
                                   name: goodsName,
                                   imgUrl,
                                   goodsLocation,
                                   attrsJson,
                                   price,
                                   marketPrice,
                                   amount,
                               }) => {
                    const attrObj = JSON.parse(attrsJson);
                    const attrDom = [];
                    for (const attrKey in attrObj) {
                        attrDom.push(
                            <div key={attrKey}>
                                {attrKey}：{attrObj[attrKey]}
                            </div>
                        );
                    }
                    let stateDom, doDom;
                    switch (orderState) {
                        case 1:
                            stateDom = <Tooltip title={
                                <div>
                                    届け先住所<br/>
                                    {name}<br/>
                                    {`${province} ${city} ${district}`}<br/>
                                    {detailedAddress}<br/>
                                    {phone}
                                </div>
                            }>
                                <a>{orderStateStr}</a>
                            </Tooltip>
                            doDom = <div style={{fontSize: "20px"}}>
                                <Tooltip title="支払って行く">
                                    <Button type="dashed" shape="circle" icon="money-collect"/>
                                </Tooltip>
                                <Tooltip title="注文をキャンセル" placement="bottom">
                                    <Button type="danger" ghost shape="circle" icon="close"/>
                                </Tooltip>
                            </div>
                            break;
                        case 2:
                            stateDom = <Tooltip title={
                                <div>
                                    届け先住所<br/>
                                    {name}<br/>
                                    {`${province} ${city} ${district}`}<br/>
                                    {detailedAddress}<br/>
                                    {phone}<br/><br/>
                                    <hr/>
                                    お支払い情報<br/>
                                    支払う方法：{payWayArr[payWay]}<br/>
                                    請求番号：{payNo}
                                </div>
                            }>
                                <a>{orderStateStr}</a>
                            </Tooltip>
                            doDom = <Tooltip title="注文をキャンセル">
                                <Button type="danger" ghost shape="circle" icon="close"/>
                            </Tooltip>
                            break;
                        case 3:
                            stateDom = <Tooltip title={
                                <div>
                                    届け先住所<br/>
                                    {name}<br/>
                                    {`${province} ${city} ${district}`}<br/>
                                    {detailedAddress}<br/>
                                    {phone}<br/><br/>
                                    <hr/>
                                    お支払い情報<br/>
                                    支払う方法：{payWayArr[payWay]}<br/>
                                    請求番号：{payNo}<br/><br/>
                                    <hr/>
                                    発送の詳細<br/>
                                    配送番号：{trackingNo}<br/>
                                    倉庫所在地：{goodsLocation}<br/>
                                    配送番号：{payWayArr[payWay]}
                                </div>
                            }>
                                <a>{orderStateStr}</a>
                            </Tooltip>
                            doDom = <Tooltip title="注文をキャンセル">
                                <Button type="danger" ghost shape="circle" icon="close"/>
                            </Tooltip>
                            break;
                        case 4:
                            doDom = <Tooltip title="返品">
                                <Button type="danger" ghost shape="circle" icon="close"/>
                            </Tooltip>
                            break;
                        default:
                            stateDom = <a>{orderStateStr}</a>
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
                        goodsName: (
                            <span style={{wordWrap: 'break-word', wordBreak: 'break-word'}}>{goodsName}</span>
                        ),
                        attrs: (
                            <div className="cart-attrs-content">
                                {attrDom.map(attr => attr)}
                            </div>
                        ),
                        price: (
                            <div className="cart-price-content">
                                {
                                    price !== marketPrice ? <span>¥{marketPrice}</span> : null
                                }

                                <span>¥{price}</span>
                            </div>
                        ),
                        amount: amount,
                        money: <span className="cart-sum">¥{dealPrice}</span>,
                        state: (<div>{stateDom}</div>),
                        orderNo: (<div>{doDom}</div>)
                    });
                });
                result.push({
                    key: `${storeId}`,
                    goodsTable: (
                        <Table
                            rowKey="id"
                            className="cart-goods-table"
                            title={() => (
                                <div className="shop-info">
                                    <Icon type="shop" style={{margin: "0 8px", fontSize: 16}}/>
                                    <span style={{fontSize: 13}}>
                                      <Link to={`/store?id=${storeId}`} onlyActiveOnIndex>{storeName}</Link>
                                </span>
                                    <span style={{fontSize: 13}}> 注文番号：{orderNo}</span>
                                </div>
                            )}
                            showHeader={false}
                            columns={[
                                {dataIndex: "img", width: "9%"},
                                {dataIndex: "goodsName", width: "22%"},
                                {dataIndex: "attrs", width: "13.5%"},
                                {dataIndex: "price", width: "12.5%"},
                                {dataIndex: "amount", width: "12%"},
                                {dataIndex: "money", width: "12%"},
                                {dataIndex: "state", width: "12%"},
                                {dataIndex: "orderNo"},
                            ]}
                            dataSource={dataSource}
                            pagination={false}
                        />
                    )
                });
            });
        });
        return result;
    }

    render() {
        return <Table
            rowKey="key"
            columns={[
                {
                    title: (
                        <div className="cart-table-head">
                            <span style={{width: "32%"}}>お宝物</span>
                            <span style={{width: "14%"}}>品物属性</span>
                            <span style={{width: "12%"}}>単価</span>
                            <span style={{width: "12%"}}>数量</span>
                            <span style={{width: "12%"}}>小計</span>
                            <span style={{width: "12%"}}>状態</span>
                            <span>操作</span>
                        </div>
                    ),
                    dataIndex: "goodsTable"
                }
            ]}
            dataSource={this.renderGoods()}
            pagination={false}
            locale={{emptyText: <Empty description='何もありません'/>}}
        />
    }
}