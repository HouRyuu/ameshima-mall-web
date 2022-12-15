import React, {Component} from "react";
import {Link} from "react-router";
import {
    Layout,
    BackTop,
    Row,
    Col,
    Steps
} from "antd";
import IndexHead from "../index/indexHead";
import TmallFooter from "../components/TmallFooter";
import "antd/dist/antd.css";
import "../style.css";
import "../index/index.css";
import "./confirm/confirm.css";

const {Step} = Steps;
const {Header, Footer, Content} = Layout;
export default class OrderSubmit extends Component {
    render() {
        const children = this.props.children;
        return (
            <Layout className="cart-warp">
                <Header className="site-nav">
                    <IndexHead loginRequire={false}/>
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
                                                src="/LOGO.png"
                                            />
                                        </Link>
                                    </Col>
                                    <Col span={16} offset={4}>
                                        <Steps labelPlacement='vertical' current={
                                            children.props.routes[0].childRoutes.findIndex(({path}) => {
                                                return path === children.props.route.path;
                                            })
                                        }>
                                            <Step title="注文確認"/>
                                            <Step title="レジ"/>
                                            <Step title="支払い完了"/>
                                            <Step title="届け確認"/>
                                            <Step title="コメント"/>
                                        </Steps>
                                    </Col>
                                </Row>
                            </Header>
                            <Content style={{backgroundColor: "#fff"}}>{children}</Content>
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
