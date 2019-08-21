import React, { Component } from "react";
import { Layout } from "antd";
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

const { Header, Footer, Content } = Layout;
export default class StoreIndex extends Component {
  state = {};
  urlUtil = null;
  constructor(props) {
    super(props);
    this.urlUtil = new UrlUtil(window.location);
  }
  findStordGoods() {
    const {
      searchParam: { id }
    } = this.urlUtil;
    this.setState({ id });
    if (id) {
      FetchUtil.get({
        url: `/goods/${id}/storeGoods`,
        success: ({ data }) => {
          const bannerGoods = [],
            promoteGoods = [];
          data.forEach(goods => {
            if (goods.isShowBanner) {
              bannerGoods.push(goods);
            }
            if (goods.isPromote) {
              promoteGoods.push(goods);
            }
          });
          this.setState({ bannerGoods, promoteGoods });
        }
      });
    }
  }
  componentWillMount() {
    this.findStordGoods();
  }
  render() {
    const { id, bannerGoods, promoteGoods } = this.state;
    return (
      <Layout className="store-warp">
        <Header className="site-nav">
          <IndexHead />
        </Header>
        <Layout>
          <Content>
            {!id ? (
              "地址错误"
            ) : (
              <Layout>
                <Header className="search-warp">
                  <StoreSearch />
                </Header>
                <Content>
                  <GoodsBanner goodsList={bannerGoods} />
                  <GoodsPromote goodsList={promoteGoods} />
                </Content>
              </Layout>
            )}
          </Content>
        </Layout>
        <Footer className="view-footer">
          <TmallFooter />
        </Footer>
      </Layout>
    );
  }
}