import React, { Component } from "react";
import { browserHistory } from "react-router";
import { Row, Col, Input } from "antd";

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
              value = value.trim();
              if (!value) return;
              browserHistory.push({
                pathname: "/search",
                search: `?q=${value}`
              });
            }}
          />
        </Col>
      </Row>
    );
  }
}
