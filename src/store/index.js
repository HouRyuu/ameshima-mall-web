import React, {Component} from "react";
import {Layout, BackTop} from "antd";
import IndexHead from "../index/indexHead";
import StoreSearch from "./StoreSearch";
import GoodsBanner from "./GoodsBanner";
import GoodsPromote from "./GoodsPromote";
import TmallFooter from "../components/TmallFooter";
import FetchUtil from "../utils/FetchUtil";
import UrlUtil from "../utils/UrlUtil";
import "antd/dist/antd.css";
import "../style.css";
import "../index/index.css";
import "./store.css";
import NotFound from "../error/NotFound";

const {Header, Footer, Content} = Layout;
export default class StoreIndex extends Component {
    state = {};

    findStordGoods() {
        const urlUtil = new UrlUtil(window.location);
        const {
            searchParam: {id}
        } = urlUtil;
        this.setState({id});
        if (id) {
            FetchUtil.get({
                url: `/goods/${id}/storeGoods`,
                success: ({data}) => {
                    const bannerGoods = [], promoteGoods = [];
                    data.forEach(goods => {
                        if (goods.isShowBanner) {
                            bannerGoods.push(goods);
                        }
                        if (goods.isPromote) {
                            promoteGoods.push(goods);
                        }
                    });
                    this.setState({bannerGoods, promoteGoods});
                },
                error: () => {
                    this.setState({id: null});
                }
            });
        }
    }

    componentWillMount() {
        this.findStordGoods();
    }

    render() {
        const {id, bannerGoods = [], promoteGoods = []} = this.state;
        return (
            <Layout className="store-warp">
                <Header className="site-nav">
                    <IndexHead/>
                </Header>
                <Layout>
                    <Content>
                        {!id ? (
                            <NotFound/>
                        ) : (
                            <Layout>
                                <Header className="search-warp">
                                    <StoreSearch id={id}/>
                                </Header>
                                <Content>
                                    {bannerGoods.length ? <GoodsBanner goodsList={bannerGoods}/> : null}
                                    {promoteGoods.length ? <GoodsPromote goodsList={promoteGoods}/> : null}
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
