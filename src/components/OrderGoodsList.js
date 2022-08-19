import React, {Component} from "react";
import {Button, Divider, Empty, Icon, Popconfirm, Popover, Table, Tag, Tooltip} from "antd";
import {browserHistory, Link} from "react-router";
import FetchUtil from "../utils/FetchUtil";
import UrlUtil from "../utils/UrlUtil";

const IconFont = Icon.createFromIconfontCN({
    scriptUrl: '//at.alicdn.com/t/c/font_3587549_fxuwnik34q.js',
})
export default class OrderGoodsList extends Component {

    state = {
        orderStateArr: [],
        payWayArr: [],
        logisticsStateArr: []
    }

    componentWillMount() {
        this.getOrderStateCfg();
        this.getPayWayCfg();
        this.getLogisticsStateCfg();
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

    renderGoods() {
        const {orderList} = this.props;
        const {orderStateArr, payWayArr, logisticsStateArr} = this.state;
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
                                                goodsLocation,
                                                targetAddress,
                                                trackingNo,
                                                logisticsState
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
                let totalFreight = 0;
                goodsList.forEach(({
                                       goodsId,
                                       skuId,
                                       name: goodsName,
                                       imgUrl,
                                       attrsJson,
                                       price,
                                       marketPrice,
                                       amount,
                                       freight
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
                                orderState > 1 ? <div>
                                    <Divider style={{color: "#fff"}}>お支払い情報</Divider>
                                    <p>支払う方法：{payWayArr[payWay]}</p>
                                    <p>請求番号：{payNo}</p>
                                    <Divider style={{color: "#fff"}}>発送の詳細</Divider>
                                    <p>倉庫所在地：{goodsLocation}</p>
                                    <p>状態：{logisticsStateArr[logisticsState]}</p>
                                    {logisticsState ? <p>配送番号：{trackingNo}</p> : null}
                                </div> : null
                            }
                        </div>
                    }>
                        <Tag color="blue">{orderStateStr}</Tag>
                    </Tooltip>);
                    let doDom = (<div style={{fontSize: "20px"}}>
                        {
                            orderState === 1 ? <div style={{fontSize: "26px"}}>
                                {
                                    payWayArr.map(way => <span><IconFont key={way} type={`icon-${way}`}/></span>)
                                }
                            </div> : orderState === 3 ? <Popconfirm
                                title="該当注文の商品は全て届きましたか？"
                                icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}
                                onConfirm={() => this.receiveConfirm(orderNo)}
                                okText="はい"
                                cancelText="いいえ"
                            >
                                <Button type="dashed" shape="circle" icon="file-protect"/>
                            </Popconfirm> : null
                        }
                        <Popconfirm
                            title="注文をキャンセルしますか？"
                            icon={<Icon type="question-circle-o" style={{color: 'red'}}/>}
                            onConfirm={null}
                            okText="はい"
                            cancelText="いいえ"
                        >
                            <Button type="danger" ghost shape="circle" icon="close"/>
                        </Popconfirm>
                    </div>);
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
                            <div>
                                <span style={{wordWrap: 'break-word', wordBreak: 'break-word'}}>{goodsName}</span>
                                <div className="cart-attrs-content">
                                    {attrDom.map(attr => attr)}
                                </div>
                            </div>
                        ),
                        // attrs: (
                        //     <div className="cart-attrs-content">
                        //         {attrDom.map(attr => attr)}
                        //     </div>
                        // ),
                        price: (
                            <div className="cart-price-content">
                                {
                                    price !== marketPrice ? <span>¥{marketPrice}</span> : null
                                }
                                <span>¥{price}</span>
                            </div>
                        ),
                        amount: amount,
                        goodsId: (
                            orderState === 4 ? <div>
                                <Tooltip title="コメント">
                                    <Link target="_blank" to={`/goods?id=${goodsId}&skuId=${skuId}&orderNo=${orderNo}`}
                                          onlyActiveOnIndex>
                                        <Button type="dashed" shape="circle" icon="highlight"/>
                                    </Link>
                                </Tooltip>
                                <Tooltip title="返品">
                                    <Button type="dashed" shape="circle" icon="rollback"/>
                                </Tooltip>
                            </div> : null

                        ),
                        money: <p className="cart-sum">¥{dealPrice}</p>,
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
                                                          <Link to={`/store?id=${storeId}`}
                                                                onlyActiveOnIndex>{storeName}</Link>
                                                    </span>
                                    <span style={{fontSize: 13}}> 注文番号：{orderNo}</span>
                                </div>
                            )}
                            showHeader={false}
                            columns={[
                                {dataIndex: "img", width: "9%"},
                                {dataIndex: "goodsName", width: "22%"},
                                // {dataIndex: "attrs", width: "13.5%"},
                                {dataIndex: "price", width: "12.5%"},
                                {dataIndex: "amount", width: "12%"},
                                {dataIndex: "goodsId", width: "13%"},
                                {
                                    dataIndex: "money",
                                    width: "12%",
                                    className: "verticalAlignCenter",
                                    render: (value, row, index) => {
                                        return {
                                            children: <div>{value}<p>(送料：¥{totalFreight})</p></div>,
                                            props: {
                                                rowSpan: !index ? goodsList.length : 0
                                            },
                                        };
                                    }
                                },
                                {
                                    dataIndex: "state",
                                    width: "12%",
                                    className: "verticalAlignCenter",
                                    render: (value, row, index) => {
                                        return {
                                            children: value,
                                            props: {
                                                rowSpan: !index ? goodsList.length : 0
                                            },
                                        };
                                    }
                                },
                                {
                                    dataIndex: "orderNo",
                                    className: "verticalAlignCenter",
                                    render: (value, row, index) => {
                                        return {
                                            children: value,
                                            props: {
                                                rowSpan: !index ? goodsList.length : 0
                                            },
                                        };
                                    }
                                },
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

    receiveConfirm(orderID) {
        FetchUtil.put({
            url: `/order/${orderID}/receive/confirm`,
            success: () => {
                const {
                    searchParam: {orderNo}
                } = new UrlUtil(window.location);
                browserHistory.push({
                    pathname: '/order/comment',
                    search: `?orderNo=${orderNo}`
                });
            }
        })
        return undefined;
    }

    render() {
        return <Table
            rowKey="key"
            columns={[
                {
                    title: (
                        <div className="cart-table-head">
                            <span style={{width: "32%"}}>お宝物</span>
                            {/*<span style={{width: "14%"}}>品物属性</span>*/}
                            <span style={{width: "12%"}}>単価</span>
                            <span style={{width: "12%"}}>数量</span>
                            <span style={{width: "13%"}}>単品操作</span>
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