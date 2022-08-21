import React, {Component} from "react";
import {Link} from "react-router";
import {
    Layout,
    Row,
    Col,
    Card,
    Tabs,
    Descriptions,
    Button,
    BackTop, List, Comment, Pagination, Empty, Tooltip, Result
} from "antd";
import IndexHead from "../index/indexHead";
import StoreSearch from "../store/StoreSearch";
import GoodsInfo from "./GoodsInfo";
import TmallFooter from "../components/TmallFooter";
import FetchUtil from "../utils/FetchUtil";
import UrlUtil from "../utils/UrlUtil";
import "antd/dist/antd.css";
import "../style.css";
import "../index/index.css";
import "../store/store.css";
import "./goods.css";
import CommentEditor from "../components/CommentEditor";
import moment from "moment";
import 'moment/locale/ja'

const {Header, Footer, Content} = Layout;
const {TabPane} = Tabs;
moment.locale("ja")
export default class GoodsIndex extends Component {
    state = {
        goods: {},
        attrs: [],
        skus: [],
        coverImgs: [],
        params: [],
        detailImgs: [],
        evaluate: {},
        getCartCount: false,
        showEvaluateForm: false,
        commentSubmitting: false,
        goodsComment: {
            goodsId: 0,
            orderNo: null,
            descScore: 5,
            evaluateText: null
        },
        evaluatePage: {
            pageIndex: 1,
            pageSize: 20,
            total: 0,
            content: []
        }
    };

    getGoodsInfo(id) {
        FetchUtil.get({
            url: `/goods/${id}/detail`,
            success: ({data}) => {
                this.setState({...data});
                const {
                    goods: {storeId}
                } = data;
                this.getEvaluate(storeId);
            },
            error: () => {
                this.setState({goods: null});
            }
        });
    }

    getEvaluate(storeId) {
        FetchUtil.get({
            url: `/store/evaluate/${storeId}/getEvaluate`,
            success: ({data: evaluate}) => this.setState({evaluate})
        });
    }

    submitComment(comment) {
        const {goodsComment, evaluatePage: {pageSize}} = this.state;
        goodsComment.descScore = comment.descScore;
        goodsComment.evaluateText = comment.evaluateText;
        FetchUtil.put({
            url: "/order/evaluate/create",
            data: goodsComment,
            sendBefore: () => this.setState({commentSubmitting: true}),
            success: () => {
                this.getGoodsInfo(goodsComment.goodsId);
                this.evaluatePage(goodsComment.goodsId, 1, pageSize);
                this.setState({showEvaluateForm: false});
                window.history.replaceState(null, null, `/goods?id=${goodsComment.goodsId}`)
            },
            complete: () => this.setState({commentSubmitting: true})
        })
    }

    evaluatePage(goodsId, pageIndex, pageSize) {
        FetchUtil.post({
            url: "/order/evaluate/page",
            data: {
                pageIndex,
                pageSize,
                goodsId
            },
            success: ({data: evaluatePage}) => {
                this.setState({evaluatePage});
            }
        })
    }

    renderEvaluateAttrs(attrsJson) {
        const attrs = JSON.parse(attrsJson);
        const attrsDom = [];
        for (const attrKey in attrs) {
            attrsDom.push(
                <span key={attrKey}
                      style={{fontSize: "12px", color: "gray", marginRight: "3px"}}>{attrKey}：{attrs[attrKey]}</span>
            );
        }
        return attrsDom;
    }


    componentWillMount() {
        const {
            searchParam: {id, skuId, orderNo}
        } = new UrlUtil(window.location);
        if (orderNo) {
            window.scroll({
                top: 300
            });
        }
        this.setState({
            showEvaluateForm: !!orderNo,
            goodsComment: {
                goodsId: id,
                skuId: skuId,
                orderNo: orderNo,
                descScore: 5,
                evaluateText: null
            }
        });
        this.getGoodsInfo(parseInt(id));
        const {evaluatePage: {pageIndex, pageSize}} = this.state;
        this.evaluatePage(parseInt(id), pageIndex, pageSize);
    }

    componentDidMount() {
        // if (this.state.showEvaluateForm) {
        window.scroll({
            top: 300
        });
        // }
    }

    render() {
        const {
            goods,
            attrs,
            skus,
            coverImgs,
            params,
            detailImgs,
            evaluate,
            getCartCount,
            showEvaluateForm,
            commentSubmitting,
            goodsComment,
            evaluatePage
        } = this.state;
        const {name, descScore, serviceScore, logisticsScore} = evaluate;
        return (
            <Layout className="store-warp">
                <Header className="site-nav">
                    <IndexHead getCartCount={getCartCount}/>
                </Header>
                <Layout>
                    <Content>
                        {!goods ? (
                            <Result
                                status="404"
                                title="404"
                                subTitle="申し訳ない。商品の販売は停止しました。"
                            />
                        ) : (
                            <Layout>
                                <Header className="search-warp">
                                    <StoreSearch evaluate={evaluate}/>
                                </Header>
                                <Content>
                                    <div className="goodsInfo-warp">
                                        <GoodsInfo
                                            goods={goods}
                                            attrs={attrs}
                                            skus={skus}
                                            coverImgs={coverImgs}
                                            addSuccess={() => {
                                                this.setState({getCartCount: true});
                                            }}
                                        />
                                        <Row>
                                            <Col span={4} offset={2}>
                                                <Card title={name}>
                                                    <div className="storeInfo-warp">
                                                        <div style={{border: "none", paddingLeft: '13px'}}>
                                                            <div className="shopdsr-item">
                                                                <div className="shopdsr-title">記述</div>
                                                                <div className="shopdsr-score">{descScore}</div>
                                                            </div>
                                                            <div className="shopdsr-item">
                                                                <div className="shopdsr-title">サービス</div>
                                                                <div className="shopdsr-score">
                                                                    {serviceScore}
                                                                </div>
                                                            </div>
                                                            <div className="shopdsr-item">
                                                                <div className="shopdsr-title">物流</div>
                                                                <div className="shopdsr-score">
                                                                    {logisticsScore}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <p>
                                                        <Link to={`/store?id=${goods.storeId}`} onlyActiveOnIndex>
                                                            <Button size="small" type="primary">
                                                                店に入る
                                                            </Button>
                                                        </Link>
                                                        <Button size="small" style={{marginLeft: 8}}>
                                                            店を収蔵
                                                        </Button>
                                                    </p>
                                                </Card>
                                            </Col>
                                            <Col span={18}>
                                                <Tabs className="goodsDetail-tab" size="large"
                                                      defaultActiveKey={!showEvaluateForm ? "1" : "2"}>
                                                    <TabPane tab="商品情報" key="1">
                                                        <Descriptions title="商品の詳細">
                                                            {params.map(({paramName, paramValue}) => (
                                                                <Descriptions.Item
                                                                    key={paramName}
                                                                    label={paramName}
                                                                >
                                                                    {paramValue}
                                                                </Descriptions.Item>
                                                            ))}
                                                        </Descriptions>
                                                        <div className="detailImg-warp">
                                                            {detailImgs.map(img => (
                                                                <img key={img} alt="" src={img}/>
                                                            ))}
                                                            <img
                                                                alt=""
                                                                style={{marginTop: 20}}
                                                                src="https://img.alicdn.com/tfs/TB1.CUdsY9YBuNjy0FgXXcxcXXa-1572-394.png"
                                                            />
                                                        </div>
                                                    </TabPane>
                                                    <TabPane
                                                        tab={
                                                            <div>
                                                                累計評判
                                                                <span
                                                                    style={{
                                                                        display: "inline-block",
                                                                        marginLeft: 10,
                                                                        color: "#38b"
                                                                    }}
                                                                >
                                                                {goods.evaluateCount}
                                                              </span>
                                                            </div>
                                                        }
                                                        key="2"
                                                    >
                                                        {
                                                            showEvaluateForm ? <CommentEditor
                                                                commentSubmitting={commentSubmitting}
                                                                {...goodsComment}
                                                                submit={comment => this.submitComment(comment)}
                                                            /> : null
                                                        }
                                                        {
                                                            evaluatePage.content && evaluatePage.content.length ? <div>
                                                                    <List
                                                                        itemLayout="horizontal"
                                                                        dataSource={evaluatePage.content}
                                                                        renderItem={item => (
                                                                            <li>
                                                                                <Comment
                                                                                    author={item.nickName}
                                                                                    avatar={item.avatar}
                                                                                    content={<div>
                                                                                        <p>{item.evaluateText}</p>
                                                                                        <p>
                                                                                            {
                                                                                                this.renderEvaluateAttrs(item.attrsJson)
                                                                                                    .map(attr => attr)
                                                                                            }
                                                                                        </p>
                                                                                    </div>}
                                                                                    datetime={<Tooltip
                                                                                        title={moment(item.createTime).format('YYYY-MM-DD HH:mm:ss')}>
                                                                                        <span>{moment(item.createTime).fromNow()}</span>
                                                                                    </Tooltip>}
                                                                                />
                                                                            </li>
                                                                        )}
                                                                    />
                                                                    <Pagination
                                                                        {...evaluatePage}
                                                                        size="small"
                                                                        style={{textAlign: 'right'}}
                                                                        onChange={(pageIndex, pageSize) =>
                                                                            this.evaluatePage(goods.id, pageIndex, pageSize)
                                                                        }
                                                                    />
                                                                </div> :
                                                                <Empty description="何もありません"/>
                                                        }
                                                    </TabPane>
                                                </Tabs>
                                            </Col>
                                        </Row>
                                    </div>
                                </Content>
                            </Layout>
                        )}
                    </Content>
                </Layout>
                <Footer className="view-footer">
                    <TmallFooter/>
                    <BackTop/>
                </Footer>
            </Layout>
        );
    }
}
