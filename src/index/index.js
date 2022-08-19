import React, {Component} from "react";
import {Layout, BackTop} from "antd";
import IndexHead from "./indexHead";
import IndexSearch from "./indexSearch";
import IndexGoodsNav from "./indexGoodsNav";
import IndexBanner from "./indexBanner";
import BrandPromote from "./BrandPromote";
import GoodsPromote from "./GoodsPromote";
import GuessLike from "./GuessLike";
import TmallFooter from "../components/TmallFooter";
import "antd/dist/antd.css";
import "../style.css";
import "./index.css";

const {Header, Footer, Content} = Layout;

export default class Index extends Component {
    render() {
        return (
            <Layout>
                <Header className="site-nav">
                    <IndexHead/>
                </Header>
                <Layout>
                    <Content>
                        <Layout>
                            <Header className="search-warp">
                                <IndexSearch/>
                            </Header>
                            <Content>
                                <IndexGoodsNav/>
                                <IndexBanner/>
                                <div className="main-warp">
                                    <BrandPromote/>
                                    <GoodsPromote/>
                                    <GuessLike/>
                                </div>
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