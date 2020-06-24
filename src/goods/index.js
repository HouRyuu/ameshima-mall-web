import React, { Component } from "react";
import { Link } from "react-router";
import {
  Layout,
  Row,
  Col,
  Card,
  Tabs,
  Descriptions,
  Button,
  BackTop
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

const { Header, Footer, Content } = Layout;
const { TabPane } = Tabs;
export default class GoodsIndex extends Component {
  state = {
    goods: {},
    attrs: [],
    skus: [],
    coverImgs: [],
    params: [],
    detailImgs: [],
    evaluate: {},
    getCartCount: false
  };
  getGoodsInfo() {
    const {
      searchParam: { id }
    } = new UrlUtil(window.location);
    if (id) {
      FetchUtil.get({
        url: `/goods/${id}/detail`,
        success: ({ errCode, data }) => {
          if (errCode) {
            this.setState({goods: null});
            return;
          }
          this.setState({ ...data });
          const {
            goods: { storeId }
          } = data;
          this.getEvaluate(storeId);
        }
      });
    }
  }
  getEvaluate(storeId) {
    FetchUtil.get({
      url: `/store/evaluate/${storeId}/getEvaluate`,
      success: ({ data: evaluate }) => this.setState({ evaluate })
    });
  }
  componentWillMount() {
    this.getGoodsInfo();
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
      getCartCount
    } = this.state;
    const { name, descScore, serviceScore, logisticsScore } = evaluate;
    return (
      <Layout className="store-warp">
        <Header className="site-nav">
          <IndexHead getCartCount={getCartCount} />
        </Header>
        <Layout>
          <Content>
            {!goods ? (
              "商品不存在"
            ) : (
              <Layout>
                <Header className="search-warp">
                  <StoreSearch evaluate={evaluate} />
                </Header>
                <Content>
                  <div className="goodsInfo-warp">
                    <GoodsInfo
                      goods={goods}
                      attrs={attrs}
                      skus={skus}
                      coverImgs={coverImgs}
                      addSuccess={() => {
                        this.setState({ getCartCount: true });
                      }}
                    />
                    <Row>
                      <Col span={4} offset={2}>
                        <Card title={name}>
                          <div className="storeInfo-warp">
                            <div style={{ border: "none" }}>
                              <div className="shopdsr-item">
                                <div className="shopdsr-title">描述</div>
                                <div className="shopdsr-score">{descScore}</div>
                              </div>
                              <div className="shopdsr-item">
                                <div className="shopdsr-title">服务</div>
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
                            <Link to={`/store?id=${goods.storeId}`}>
                              <Button size="small" type="primary">
                                进店逛逛
                              </Button>
                            </Link>
                            <Button size="small" style={{ marginLeft: 8 }}>
                              收藏店铺
                            </Button>
                          </p>
                        </Card>
                      </Col>
                      <Col span={18}>
                        <Tabs className="goodsDetail-tab" size="large">
                          <TabPane tab="商品详情" key="1">
                            <Descriptions title="产品参数">
                              {params.map(({ paramName, paramValue }) => (
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
                                <img key={img} alt="" src={img} />
                              ))}
                              <img
                                alt=""
                                style={{ marginTop: 20 }}
                                src="https://img.alicdn.com/tfs/TB1.CUdsY9YBuNjy0FgXXcxcXXa-1572-394.png"
                              />
                            </div>
                          </TabPane>
                          <TabPane
                            tab={
                              <div>
                                累计评价
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
                            Content of tab 2
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
          <TmallFooter />
          <BackTop />
        </Footer>
      </Layout>
    );
  }
}
