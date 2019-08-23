import React, { Component } from "react";
import { Layout } from "antd";
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

const { Header, Footer, Content } = Layout;
export default class GoodsIndex extends Component {
  state = {};
  constructor(props) {
    super(props);
  }
  findGoodsInfo() {
    const urlUtil = new UrlUtil(window.location);
    const {
      searchParam: { id }
    } = urlUtil;
    this.setState({ id });
    if (id) {
      FetchUtil.get({
        url: `/goods/${id}/detail`,
        success: ({ data }) => this.setState({ ...data })
      });
    }
  }
  componentWillMount() {
    this.findGoodsInfo();
  }
  render() {
    const {
      id,
      goods = {},
      attrs = [],
      skus = [],
      coverImgs = [],
      params = [],
      detailImgs = []
    } = this.state;
    return (
      <Layout className="store-warp">
        <Header className="site-nav">
          <IndexHead />
        </Header>
        <Layout>
          <Content>
            {!id ? (
              "地址错误"
            ) : !goods ? (
              "商品不存在"
            ) : (
              <Layout>
                <Header className="search-warp">
                  <StoreSearch />
                </Header>
                <Content>
                  <div className="goodsInfo-warp">
                    <GoodsInfo
                      goods={goods}
                      attrs={attrs}
                      skus={skus}
                      coverImgs={coverImgs}
                    />
                  </div>
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
