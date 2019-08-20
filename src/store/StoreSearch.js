import React, { Component } from "react";
import { Link } from "react-router";
import { Row, Col, Icon, Input, AutoComplete } from "antd";

export default class StoreSearch extends Component {
  render() {
    return (
      <Row type="flex" align="middle" className="storeHead-warp">
        <Col span={4}>
          <Link to="/">
            <img
              className="tmall-logo"
              alt="首页"
              src="//img.alicdn.com/tfs/TB1_Gn8RXXXXXXqaFXXXXXXXXXX-380-54.png"
            />
          </Link>
        </Col>
        <Col span={7} className="storeInfo-warp">
          <div>
            <h2>stokke旗舰店</h2>
          </div>
        </Col>
        <Col span={8} offset={5}>
          <AutoComplete
            className="global-search"
            size="large"
            style={{ width: "100%" }}
            placeholder="搜索 本店 商品/品牌"
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
