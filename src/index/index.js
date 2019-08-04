import React, { Component } from "react";
import { Layout } from "antd";
import IndexHead from "./indexHead";
import IndexSearch from "./indexSearch";
import IndexGoodsNav from "./indexGoodsNav";
import IndexBanner from "./indexBanner";
import BrandPromote from "./BrandPromote";
import "antd/dist/antd.css";
import "../style.css";
import "./index.css";

const { Header, Footer, Content } = Layout;
class Index extends Component {
  render() {
    return (
      <Layout>
        <Header className="site-nav">
          <IndexHead />
        </Header>
        <Layout>
          <Content>
            <Layout>
              <Header className="search-warp">
                <IndexSearch />
              </Header>
              <Content>
                <div>
                  <IndexGoodsNav />
                  <IndexBanner />
                  <BrandPromote />
                </div>
              </Content>
            </Layout>
          </Content>
        </Layout>
        <Footer>Footer</Footer>
      </Layout>
    );
  }
}

export default Index;
