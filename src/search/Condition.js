import React, { Component } from "react";
import {
  Descriptions,
  Breadcrumb,
  Tag,
  Row,
  Col,
  Icon,
  Input,
  Button,
  Pagination,
  InputNumber
} from "antd";
import FetchUtil from "../utils/FetchUtil";

const { CheckableTag } = Tag;
export default class Condition extends Component {
  state = {
    brands: [],
    categories: [],
    queryParam: {},
    goodsPage: {
      pageSize: 60,
      pageIndex: 0,
      total: 0
    }
  };
  findBrandsAndCategories(queryParam) {
    FetchUtil.post({
      url: "/goods/findBrandsAndCategories",
      data: queryParam,
      success: ({ data }) => this.setState({ ...data })
    });
  }
  componentWillMount() {
    this.componentWillReceiveProps(this.props);
  }
  componentWillReceiveProps(props) {
    const { queryParam, callQuery, goodsPage } = props;
    this.setState({ queryParam: { ...queryParam }, callQuery, goodsPage });
    this.findBrandsAndCategories(props.queryParam);
  }
  getBreadcrumb(category, brand) {
    return (
      <Breadcrumb separator=">">
        <Breadcrumb.Item>全部</Breadcrumb.Item>
        {category ? <Breadcrumb.Item>{category}</Breadcrumb.Item> : null}
        {brand ? <Breadcrumb.Item>{brand}</Breadcrumb.Item> : null}
      </Breadcrumb>
    );
  }
  selectBrandOrCategory(checked, value, type) {
    const { queryParam, callQuery } = this.state;
    queryParam.pageIndex = 0;
    if (type === "brand" && checked) {
      queryParam.brand = value;
    } else if (type === "brand" && !checked) {
      queryParam.brand = null;
    } else if (type === "category" && checked) {
      queryParam.category = value;
    } else {
      queryParam.category = null;
    }
    callQuery(queryParam);
  }
  order(field) {
    const { queryParam, callQuery } = this.state;
    const { orderField, orderType } = queryParam;
    if (!field && !orderField) return;
    if (!field) {
      queryParam.orderField = field;
    } else if (field === "salesVolume") {
      queryParam.orderField = orderField !== "salesVolume" ? field : null;
      queryParam.orderType = "DESC";
    } else {
      if (orderField !== "price") {
        queryParam.orderField = field;
        queryParam.orderType = "ASC";
      } else if (orderType === "ASC") {
        queryParam.orderType = "DESC";
      } else {
        queryParam.orderField = null;
      }
    }
    callQuery(queryParam);
  }
  render() {
    const {
      queryParam: {
        brand,
        category,
        orderField,
        orderType,
        minPrice,
        maxPrice
      },
      brands,
      categories,
      callQuery,
      goodsPage
    } = this.state;
    const { pageSize, pageIndex, total } = goodsPage;
    return (
      <div style={{ marginTop: 20 }}>
        <Descriptions
          bordered
          size="small"
          title={this.getBreadcrumb(category, brand)}
          column={1}
        >
          <Descriptions.Item label="品牌">
            {brands.map(item => (
              <CheckableTag
                key={item}
                checked={brand === item}
                onChange={checked =>
                  this.selectBrandOrCategory(checked, item, "brand")
                }
              >
                {item}
              </CheckableTag>
            ))}
          </Descriptions.Item>
          <Descriptions.Item label="分类">
            {categories.map(item => (
              <CheckableTag
                key={item}
                checked={category === item}
                onChange={checked =>
                  this.selectBrandOrCategory(checked, item, "category")
                }
              >
                {item}
              </CheckableTag>
            ))}
          </Descriptions.Item>
        </Descriptions>
        <Row className="filter-line" type="flex" align="middle">
          <Col className="sort-warp" span={4}>
            <span
              className={!orderField ? "cur-sort" : null}
              onClick={() => this.order()}
              title="点击后恢复默认排序"
            >
              综合
              <Icon type="arrow-down" />
            </span>
            <span
              className={"salesVolume" === orderField ? "cur-sort" : null}
              onClick={() => this.order("salesVolume")}
              title={
                "salesVolume" === orderField
                  ? "点击后恢复默认排序"
                  : "点击后按销量从高到低"
              }
            >
              销量
              <Icon type="arrow-down" />
            </span>
            <span
              className={
                "price" === orderField && "DESC" === orderType
                  ? "cur-sort down"
                  : "price" === orderField && "ASC" === orderType
                  ? "cur-sort up"
                  : null
              }
              onClick={() => this.order("price")}
              title={
                "price" === orderField && "DESC" === orderType
                  ? "点击后恢复默认排序"
                  : "price" === orderField && "ASC" === orderType
                  ? "点击后按价格降序"
                  : "点击后按价格升序"
              }
            >
              价格
              <Icon type="caret-up" style={{ top: 2 }} />
              <Icon type="caret-down" style={{ top: 10 }} />
            </span>
          </Col>
          <Col span={6}>
            <Input.Group compact>
              <InputNumber
                allowClear
                style={{ width: 86, textAlign: "center" }}
                placeholder="最低价"
                step={0.1}
                min={0}
                max={maxPrice ? maxPrice : 999999999}
                onChange={value => {
                  const { queryParam } = this.state;
                  queryParam.minPrice = value;
                  this.setState({ queryParam });
                }}
              />
              <Input
                style={{
                  width: 30,
                  pointerEvents: "none",
                  backgroundColor: "#fff"
                }}
                placeholder="~"
                disabled
              />
              <InputNumber
                allowClear
                style={{ width: 86, textAlign: "center" }}
                placeholder="最高价"
                step={0.1}
                min={minPrice ? minPrice : 0}
                onChange={value => {
                  const { queryParam } = this.state;
                  queryParam.maxPrice = value;
                  this.setState({ queryParam });
                }}
              />
              <Button
                type="primary"
                onClick={() => {
                  const { queryParam } = this.state;
                  callQuery(queryParam);
                }}
              >
                确定
              </Button>
            </Input.Group>
          </Col>
          <Col span={4} offset={10}>
            <Pagination
              simple
              current={pageIndex + 1}
              total={total}
              pageSize={pageSize}
              onChange={page => {
                const { queryParam } = this.state;
                queryParam.pageIndex = page - 1;
                callQuery(queryParam);
              }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}
