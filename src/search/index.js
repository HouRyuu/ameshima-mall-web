import React, {Component} from "react";
import {Link, browserHistory} from "react-router";
import {Layout, BackTop, Row, Col, Input, Pagination, Result} from "antd";
import IndexHead from "../index/indexHead";
import TmallFooter from "../components/TmallFooter";
import Condition from "./Condition";
import GoodsList from "../components/GoodsList";
import FetchUtil from "../utils/FetchUtil";
import UrlUtil from "../utils/UrlUtil";
import "antd/dist/antd.css";
import "../style.css";
import "../index/index.css";
import "./search.css";

const {Header, Footer, Content} = Layout;
export default class SearchIndex extends Component {
    state = {
        queryParam: {
            pageIndex: 0
        },
        goodsPage: {
            pageSize: 60,
            pageIndex: 0,
            total: 1,
            content: []
        }
    };

    initQ() {
        const {
            searchParam: {q: word, s: storeId}
        } = new UrlUtil();
        if (!word) {
            browserHistory.push("/");
            return;
        }
        const queryParam = {
            word,
            storeId: isNaN(storeId) ? '' : storeId,
            pageIndex: 0
        };
        this.setState({queryParam});
        this.indexGoods(queryParam);
    }

    componentWillMount() {
        this.initQ();
    }

    componentWillReceiveProps() {
        this.initQ();
    }

    indexGoods(queryParam) {
        FetchUtil.post({
            url: "/goods/indexGoods",
            data: queryParam,
            success: ({data: goodsPage}) => this.setState({queryParam, goodsPage})
        });
    }

    callQuery(queryParam) {
        this.indexGoods(queryParam);
    }

    render() {
        const {queryParam, goodsPage} = this.state;
        const {pageSize, pageIndex, total, content} = goodsPage;
        return (
            <Layout className="search-page">
                <Header className="site-nav">
                    <IndexHead/>
                </Header>
                <Layout>
                    <Content>
                        <Layout>
                            <Header className="search-warp">
                                <Row type="flex" align="middle">
                                    <Col span={4}>
                                        <Link to="/" onlyActiveOnIndex>
                                            <img
                                                className="tmall-logo"
                                                alt="トップページ"
                                                src={`${window.origin}/LOGO.png`}
                                            />
                                        </Link>
                                    </Col>
                                    <Col span={10} offset={3}>
                                        <Input.Search
                                            className="global-search"
                                            size="large"
                                            style={{width: "100%"}}
                                            placeholder="検索 雨島 商品/ブランド/店舗"
                                            defaultValue={queryParam.word}
                                            onSearch={value => {
                                                value = value.trim();
                                                if (!value) return;
                                                browserHistory.push({
                                                    pathname: "/search",
                                                    search: `?q=${value}&s=${queryParam.storeId ? queryParam.storeId : ''}`
                                                });
                                            }}
                                        />
                                    </Col>
                                </Row>
                            </Header>
                            <Content>
                                {total > 0 ? (
                                    <div className="main-warp">
                                        <Condition
                                            queryParam={queryParam}
                                            callQuery={this.callQuery.bind(this)}
                                            goodsPage={goodsPage}
                                        />
                                        <GoodsList goodsList={content}/>
                                        <div className="page-line">
                                            <Pagination
                                                showQuickJumper
                                                pageSize={pageSize}
                                                defaultCurrent={pageIndex + 1}
                                                total={total}
                                                onChange={page => {
                                                    queryParam.pageIndex = page - 1;
                                                    this.indexGoods(queryParam);
                                                }}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <Result
                                        status="404"
                                        title={'関連商品が見つかりませんんでした'}
                                    />
                                )}
                            </Content>
                        </Layout>
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
