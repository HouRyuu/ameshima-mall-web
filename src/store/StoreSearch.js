import React, { Component } from "react";
import { Link } from "react-router";
import { Row, Col, Icon, Input, AutoComplete } from "antd";
import FetchUtil from "../utils/FetchUtil";

export default class StoreSearch extends Component {
  state = { evaluate: {} };
  getEvaluate(id) {
    if (id)
      FetchUtil.get({
        url: `/store/evaluate/${id}/getEvaluate`,
        success: ({ data: evaluate }) => {
          this.setState({ evaluate });
        }
      });
  }
  componentWillReceiveProps(props) {
    const { id, evaluate } = props;
    if (id) {
      this.getEvaluate(id);
    } else {
      this.setState({ evaluate });
    }
  }
  render() {
    const {
      evaluate: { storeId, name, descScore, serviceScore, logisticsScore }
    } = this.state;
    return (
      <Row type="flex" align="middle" className="storeHead-warp">
        <Col span={4}>
          <Link to="/">
            <img
              className="tmall-logo"
              alt="トップページ"
              src="//img.alicdn.com/tfs/TB1_Gn8RXXXXXXqaFXXXXXXXXXX-380-54.png"
            />
          </Link>
        </Col>
        <Col span={3} className="storeInfo-warp">
          <div>
            <Link to={`/store?id=${storeId}`} title={name}>
              {name}
            </Link>
          </div>
        </Col>
        <Col span={4} className="storeInfo-warp">
          <div>
            <div className="shopdsr-item">
              <div className="shopdsr-title">描述</div>
              <div className="shopdsr-score">{descScore}</div>
            </div>
            <div className="shopdsr-item">
              <div className="shopdsr-title">服务</div>
              <div className="shopdsr-score">{serviceScore}</div>
            </div>
            <div className="shopdsr-item">
              <div className="shopdsr-title">物流</div>
              <div className="shopdsr-score">{logisticsScore}</div>
            </div>
          </div>
        </Col>
        <Col span={8} offset={5}>
          <AutoComplete
            className="global-search"
            size="large"
            style={{ width: "100%" }}
            placeholder="検索 当店 商品/ブランド"
            optionLabelProp="text"
          >
            <Input
              suffix={<Icon type="search" className="certain-category-icon" />}
            />
          </AutoComplete>
        </Col>
      </Row>
    );
  }
}
