import React, {Component} from "react";
import {Button, Col, Descriptions, Icon, Input, Popover, Row, Table, Tag} from "antd";
import "./index.css";
import FetchUtil from "../../utils/FetchUtil";
import ButtonGroup from "antd/es/button/button-group";
import GoodsEdit from "./GoodsEdit";
import "./index.css";

export default class StoreManageGoods extends Component {
    columns = [
        {
            title: '写真',
            dataIndex: 'imgUrl',
            width: "14%",
            className: "vertical-top",
            render: (imgUrl) => {
                return (<Popover
                    placement="right"
                    content={<img alt="" width="320" src={imgUrl}/>}
                >
                    <img alt="" width="88" className="cart-goods-img" src={imgUrl}/>
                </Popover>)
            }
        }, {
            title: '商品名',
            dataIndex: 'name',
            width: "28%",
            className: "vertical-top",
            render: name => <small>{name}</small>
        }, {
            title: '記述',
            width: "28%",
            className: "vertical-top",
            dataIndex: 'simpleDesc',
            render: simpleDesc => <small>{simpleDesc}</small>
        }, {
            title: '価格',
            className: "vertical-top",
            dataIndex: 'price'
        }, {
            title: '状態',
            className: "vertical-top",
            dataIndex: 'status',
            render: status => <Tag color={status ? "green" : "red"}>{status ? "品出し済" : "未出し"}</Tag>
        }, {
            title: '操作',
            className: "vertical-top",
            dataIndex: 'id',
            render: (id, {status}) => {
                if (status) {
                    return <ButtonGroup>
                        <Button type="dashed" size="small"
                                onClick={() => this.setState({editGoods: {goodsId: id, isEdit: false}})}>
                            <Icon type="file-protect"/>
                        </Button>
                        <Button type="danger" size="small">棚卸</Button>
                    </ButtonGroup>
                }
                return <ButtonGroup>
                    <Button type="dashed" size="small"
                            onClick={() => this.setState({editGoods: {goodsId: id, isEdit: true}})}>
                        <Icon type="edit"/>
                    </Button>
                    <Button type="danger" size="small"><Icon type="delete"/></Button>
                </ButtonGroup>
            }
        }
    ]
    state = {
        goodsQuery: {
            goodsName: '',
            isPromote: 0,
            pageIndex: 1,
            pageSize: 2
        },
        goodsPage: {
            total: 0,
            dataSource: []
        },
        editGoods: {
            goodsId: 0,
            isEdit: false,
            editVisible: false
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

    render() {
        const {
            goodsQuery,
            goodsPage: {total, content: goodsList},
            editGoods
        } = this.state;
        const {goodsName, pageIndex, pageSize} = goodsQuery;
        return <main className="store-manage-main">
            <GoodsEdit {...editGoods} onClose={() => {
                editGoods.goodsId = 0;
                this.setState({editGoods})
            }} saveCallback={() => this.goodsPage()}/>
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
                            <Button size="small" onClick={() => this.goodsPage()}>検索</Button>
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