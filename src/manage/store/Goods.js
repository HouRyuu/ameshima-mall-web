import React, {Component} from "react";
import {Button, Col, Descriptions, Input, message, Popover, Row, Table, Tag, Tooltip} from "antd";
import "./index.css";
import FetchUtil from "../../utils/FetchUtil";
import ButtonGroup from "antd/es/button/button-group";
import GoodsEdit from "./GoodsEdit";
import "./index.css";
import GoodsAttributeEdit from "./GoodsAttributeEdit";
import GoodsSKUEdit from "./GoodsSKUEdit";
import {Link} from "react-router";

/**
 * お店の商品
 */
export default class StoreManageGoods extends Component {
    columns = [
        {
            title: '写真',
            dataIndex: 'imgUrl',
            width: "10%",
            className: "vertical-top",
            render: (imgUrl) => {
                return (<Popover
                    placement="right"
                    content={<img alt="" width="320" src={imgUrl}/>}
                >
                    <img alt="" width="88" height="88" className="cart-goods-img" src={imgUrl}/>
                </Popover>)
            }
        }, {
            title: '商品名',
            dataIndex: 'name',
            width: "26%",
            className: "vertical-top",
            render: (name, {id, status}) => {
                return status ?
                    <Link to={`/goods?id=${id}`} target="_blank"
                          onlyActiveOnIndex><small>{name}</small></Link> :
                    <small>{name}</small>
            }
        }, {
            title: '記述',
            width: "26%",
            className: "vertical-top",
            dataIndex: 'simpleDesc',
            render: simpleDesc => <small>{simpleDesc}</small>
        }, {
            title: '価格',
            width: "12%",
            className: "vertical-top",
            dataIndex: 'price'
        }, {
            title: '状態',
            width: "12%",
            className: "vertical-top",
            dataIndex: 'status',
            render: status => <Tag color={status ? "green" : "red"}>{status ? "品出し済" : "未出し"}</Tag>
        }, {
            title: '操作',
            className: "vertical-top",
            dataIndex: 'id',
            render: (id, record) => {
                const {status} = record;
                return <ButtonGroup>
                    <Tooltip title="詳細情報" placement="bottom">
                        <Button type="dashed" size="small"
                                icon="file-protect"
                                onClick={() => this.setState({
                                    editGoods: {
                                        goodsId: id,
                                        visible: true,
                                        isEdit: !status
                                    }
                                })}/>
                    </Tooltip>
                    <Tooltip title="属性" placement="bottom">
                        <Button type="dashed" size="small"
                                icon="profile"
                                onClick={() => this.setState({
                                    editAttr: {
                                        goodsId: id,
                                        visible: true,
                                        isEdit: !status
                                    }
                                })}/>
                    </Tooltip>
                    <Tooltip title="SKU" placement="bottom">
                        <Button type="dashed" size="small"
                                icon="barcode"
                                onClick={() => this.setState({
                                    editSKU: {
                                        goodsId: id,
                                        visible: true,
                                        isEdit: !status
                                    }
                                })}/>
                    </Tooltip>
                    {status ?
                        <Tooltip title="棚卸" placement="bottom">
                            <Button type="danger" size="small" icon="stop" onClick={() => this.withdrawGoods(record)}/>
                        </Tooltip> :
                        <Tooltip title="品出し" placement="bottom">
                            <Button size="small" icon="bell" onClick={() => this.stackGoods(record)}/>
                        </Tooltip>
                    }
                </ButtonGroup>
            }

        }
    ]
    state = {
        goodsQuery: {
            goodsName: '',
            isPromote: 0,
            pageIndex: 1,
            pageSize: 10
        },
        goodsPage: {
            total: 0,
            dataSource: []
        },
        editGoods: {
            goodsId: 0,
            isEdit: false,
            visible: false
        },
        editAttr: {
            goodsId: 0,
            isEdit: false,
            visible: false
        },
        editSKU: {
            goodsId: 0,
            isEdit: false,
            visible: false
        }
    };

    componentDidMount() {
        this.goodsPage();
    }

    goodsPage(pageIndex = 1) {
        const {goodsQuery} = this.state;
        goodsQuery.pageIndex = pageIndex;
        FetchUtil.post({
            url: '/goods/store/page',
            data: goodsQuery,
            success: ({data: goodsPage}) => this.setState({goodsQuery, goodsPage})
        })
    }

    withdrawGoods(record) {
        FetchUtil.put({
            url: `/goods/store/${record.id}/withdraw`,
            success: () => {
                message.info("配信を停止しました")
                record.status = 0;
                this.setState({});
            }
        });
    }

    stackGoods(record) {
        FetchUtil.put({
            url: `/goods/store/${record.id}/stack`,
            success: () => {
                message.info("品出しが完了しました")
                record.status = 1;
                this.setState({});
            }
        });
    }

    render() {
        const {
            goodsQuery,
            goodsPage: {total, content: goodsList},
            editGoods,
            editAttr,
            editSKU
        } = this.state;
        const {goodsName, pageIndex, pageSize} = goodsQuery;
        return <main className="store-manage-main">
            <GoodsEdit {...editGoods} onClose={() => {
                editGoods.visible = false;
                this.setState({editGoods})
            }} saveCallback={() => {
                editGoods.visible = false;
                this.setState({editGoods})
                this.goodsPage()
            }}/>
            <GoodsAttributeEdit {...editAttr} onClose={() => {
                editAttr.visible = false;
                this.setState({editAttr})
            }}/>
            <GoodsSKUEdit {...editSKU} onClose={() => {
                editSKU.visible = false;
                this.setState({editSKU})
            }}/>
            <Descriptions className="store-goods-con" title="商品管理" layout="vertical" column={1}>
                <Descriptions.Item label="コンディション">
                    <Row type="flex" align="middle" gutter={16}>
                        <Col span={6}>
                            <Input value={goodsName} maxLength={128} placeholder="商品名" onChange={e => {
                                goodsQuery.goodsName = e.target.value;
                                this.setState({goodsQuery});
                            }}/>
                        </Col>
                        <Col span={2}>
                            <ButtonGroup>
                                <Button size="small" onClick={() => this.goodsPage()} icon="search"/>
                                <Button size="small" onClick={() => this.setState({
                                    editGoods: {
                                        goodsId: 0,
                                        isEdit: true,
                                        visible: true
                                    }
                                })} icon="plus"/>
                            </ButtonGroup>
                        </Col>
                    </Row>
                </Descriptions.Item>
                <Descriptions.Item label="商品リスト">
                    <Table
                        columns={this.columns}
                        dataSource={goodsList}
                        pagination={{
                            pageSize,
                            pageIndex,
                            total,
                            onChange: pageNum => this.goodsPage(pageNum)
                        }}
                    />
                </Descriptions.Item>
            </Descriptions>
        </main>
    }
}