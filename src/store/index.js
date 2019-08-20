import React, { Component } from "react";
import { Layout } from "antd";
import IndexHead from "../index/indexHead";
import StoreSearch from "./StoreSearch";
import GoodsBanner from "./GoodsBanner";
import GoodsPromote from "./GoodsPromote";
import TmallFooter from "../components/TmallFooter";
import "antd/dist/antd.css";
import "../style.css";
import "../index/index.css";
import "./store.css";

const { Header, Footer, Content } = Layout;
export default class StoreIndex extends Component {
  render() {
    return (
      <Layout className="store-warp">
        <Header className="site-nav">
          <IndexHead />
        </Header>
        <Layout>
          <Content>
            <Layout>
              <Header className="search-warp">
                <StoreSearch />
              </Header>
              <Content>
                <GoodsBanner />
                <GoodsPromote />
              </Content>
            </Layout>
          </Content>
        </Layout>
        <Footer className="view-footer">
          <TmallFooter />
        </Footer>
      </Layout>
    );
  }
}
