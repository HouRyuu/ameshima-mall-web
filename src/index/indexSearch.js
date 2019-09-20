import React, { Component } from "react";
import { Row, Col, Icon, Input, AutoComplete } from "antd";

export default class IndexSearch extends Component {
  render() {
    return (
      <Row type="flex" align="middle" justify="center">
        <Col span={10}>
          <Input.Search
            className="global-search"
            size="large"
            style={{ width: "100%" }}
            placeholder="搜索 天猫 商品/品牌/店铺"
            onSearch={value => {
              window.location = `/search?q=${value}`;
            }}
          />
        </Col>
      </Row>
    );
  }
}
