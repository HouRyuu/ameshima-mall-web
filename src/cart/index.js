import React, { Component } from "react";
import { Link, browserHistory } from "react-router";
import {
  Layout,
  BackTop,
  Table,
  InputNumber,
  Checkbox,
  Icon,
  Row,
  Col,
  Input,
  Popover,
  Button,
  Tag,
  Affix,
  message,
  Popconfirm
} from "antd";
import IndexHead from "../index/indexHead";
import TmallFooter from "../components/TmallFooter";
import FetchUtil from "../utils/FetchUtil";
import "antd/dist/antd.css";
import "../style.css";
import "../index/index.css";
import "./cart.css";

const { Header, Footer, Content } = Layout;
export default class CartIndex extends Component {
  constructor(props) {
    super(props);
    this.state = {
      storeList: [],
      goodsCount: 0,
      totalPrice: 0,
      checkedCartIds: [],
      delAllVisible: false
    };
  }
  findCartGoods() {
    FetchUtil.get({
      url: "/goods/shoppingCart/findGoods",
      success: ({ data: storeList }) => {
        if (storeList)
          this.setState({
            storeList,
            hasInvalid: !!storeList.some(store => !store.goodsState)
          });
      }
    });
  }
  removeCartGoods(id) {
    const ids = id ? [id] : this.state.checkedCartIds;
    if (!ids || !ids.length) {
      message.warning("请选择宝贝");
      return;
    }
    FetchUtil.post({
      url: '/goods/shoppingCart/remove',
      data: { ids },
      success: ({ errCode, errMsg }) => {
        if (errCode && errMsg) {
          message.info(errMsg)
          return;
        }
        const { storeList: oldStoreList } = this.state;
        let storeList = [], goodsList;
        oldStoreList.forEach(store => {
          goodsList = [];
          store.goodsList.forEach(goods => {
            if (ids.indexOf(goods.id) < 0) {
              goodsList.push(goods);
            }
          });
          if (goodsList.length) {
            store.goodsList = goodsList;
            storeList.push(store);
          }
        });
        this.setState({ storeList });
      }
    });
  }
  componentWillMount() {
    this.findCartGoods();
  }
  checkGoods(checked, checkStoreId, checkCartId) {
    const { storeList } = this.state;
    let storeGoodsCount = 0; // 店铺下商品总数
    let checkGoodsCount; // 店铺下选中商品总数
    let storeCount = 0; // 可选店铺总数
    let checkStoreCount = 0; // 已选店铺总数
    const checkedCartIds = [];
    storeList.forEach(store => {
      const { storeId, goodsState, goodsList } = store;
      if (!goodsState) {
        storeCount++; // 计算可选店铺总数
        storeGoodsCount = goodsList.length;
        checkGoodsCount = 0;
        goodsList.forEach(goods => {
          const { id } = goods;
          // 根据参数改变SKU选中状态
          if (
            !checkStoreId ||
            (checkStoreId && !checkCartId && checkStoreId === storeId) ||
            (checkStoreId && checkCartId && checkCartId === id)
          ) {
            goods.checked = checked;
          }
          // 根据SKU选中状态计算店铺下选中SKU数、总选中SKU数以及总选中SKU价格
          if (goods.checked) {
            checkedCartIds.push(id);
            checkGoodsCount++;
          }
        });
        // 店铺下SKU数和选中SKU数一致，将店铺选中状态置为true，选中店铺数量+1
        if (storeGoodsCount === checkGoodsCount) {
          store.checkedStore = true;
          checkStoreCount++;
        } else {
          // 否则店铺选中状态置为false
          store.checkedStore = false;
        }
      }
    });
    this.setState({
      allChecked: storeCount === checkStoreCount,
      storeList,
      checkedCartIds
    });
  }
  updateAmount(amount, cartId) {
    FetchUtil.put({
      url: `/goods/shoppingCart/${cartId}/amount/${amount}/update`,
      success: ({ errCode, errMsg }) => {
        if (errCode) {
          message.error(errMsg);
          return;
        }
        const { storeList } = this.state;
        let cart;
        storeList.find(store => {
          cart = store.goodsList.find(cart => cart.id === cartId);
          if (cart) {
            cart.amount = amount;
          }
          return !!cart;
        });
        this.setState({ storeList });
      }
    })
  }
  renderGoods(storeList) {
    const result = [];
    if (!storeList || !storeList.length) return [];
    storeList.forEach(item => {
      const { storeId, storeName, goodsState, goodsList, checkedStore } = item;
      const dataSource = [];
      goodsList.forEach(goods => {
        const {
          id,
          goodsId,
          name,
          imgUrl,
          attrsJson,
          price,
          marketPrice,
          amount,
          quantity,
          checked
        } = goods;
        let attrObj = JSON.parse(attrsJson);
        const attrDom = [];
        for (const attrKey in attrObj) {
          attrDom.push(
            <div key={attrKey}>
              {attrKey}：{attrObj[attrKey]}
            </div>
          );
        }
        dataSource.push({
          id,
          key:
            goodsState === 0 ? (
              <Checkbox
                value={id}
                checked={checked}
                onChange={({ target: { checked } }) =>
                  this.checkGoods(checked, storeId, id)
                }
              />
            ) : (
                <Checkbox disabled />
              ),
          img: (
            <Popover
              placement="right"
              content={<img alt="" width="320" src={imgUrl} />}
            >
              <img alt="" className="cart-goods-img" src={imgUrl} />
            </Popover>
          ),
          name: goodsState ? (
            name
          ) : (
              <Link to={`/goods?id=${goodsId}`}>{name}</Link>
            ),
          attrs: (
            <div className="cart-attrs-content">
              {attrDom.map(attr => attr)}
              <div>库存{quantity}件</div>
            </div>
          ),
          price:
            price === marketPrice ? (
              <span className="cart-price-content">￥{price}</span>
            ) : (
                <div className="cart-price-content">
                  <span>￥{marketPrice}</span>
                  <span>￥{price}</span>
                </div>
              ),
          amount: goodsState ? (
            amount
          ) : (
              <InputNumber min={1} max={quantity} defaultValue={amount} onChange={(value) => this.updateAmount(value, id)} />
            ),
          money: <span className="cart-sum">￥{price * amount}</span>,
          operate: (
            <Popconfirm
              title=">_<真的要把我删掉吗？"
              onConfirm={() => this.removeCartGoods(id)}
            >
              <Button type="link">删除</Button>
            </Popconfirm>
          )
        });
      });
      result.push({
        key: `${storeId}-${goodsState}`,
        goodsTable: (
          <Table
            rowKey="id"
            className="cart-goods-table"
            title={() => (
              <div className="shop-info">
                {goodsState === 0 ? (
                  <Checkbox
                    style={{ marginTop: -3 }}
                    value={storeId}
                    checked={checkedStore}
                    onChange={({ target: { checked } }) =>
                      this.checkGoods(checked, storeId)
                    }
                  />
                ) : (
                    <Tag>已失效</Tag>
                  )}
                <Icon type="shop" style={{ margin: "0 8px", fontSize: 16 }} />
                <span style={{ fontSize: 13 }}>
                  店铺：<Link to={`/store?id=${storeId}`}>{storeName}</Link>
                </span>
              </div>
            )}
            showHeader={false}
            columns={[
              { dataIndex: "key" },
              { dataIndex: "img" },
              { dataIndex: "name" },
              { dataIndex: "attrs" },
              { dataIndex: "price" },
              { dataIndex: "amount" },
              { dataIndex: "money" },
              { dataIndex: "operate" }
            ]}
            dataSource={dataSource}
            pagination={false}
          />
        )
      });
    });
    return result;
  }
  render() {
    const {
      storeList,
      hasInvalid,
      allChecked,
      delAllVisible
    } = this.state;
    let goodsCount = 0; // 选中SKU数量
    let totalPrice = 0; // 选中SKU总价
    if (storeList) {
      storeList.forEach(store => {
        store.goodsList.forEach(goods => {
          if (goods.checked) {
            goodsCount += goods.amount;
            totalPrice += goods.amount * goods.price;
          }
        })
      })
    }
    return (
      <Layout className="cart-warp">
        <Header className="site-nav">
          <IndexHead loginRequire={true} />
        </Header>
        <Layout>
          <Content>
            <Layout>
              <Header className="search-warp">
                <Row type="flex" align="middle">
                  <Col span={4}>
                    <Link to="/">
                      <img
                        className="tmall-logo"
                        alt="首页"
                        src="//img.alicdn.com/tfs/TB1_Gn8RXXXXXXqaFXXXXXXXXXX-380-54.png"
                      />
                    </Link>
                  </Col>
                  <Col span={10} offset={3}>
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
              </Header>
              <Content style={{ backgroundColor: "#fff" }}>
                <div className="cart-table">
                  <Table
                    rowKey="key"
                    columns={[
                      {
                        title: (
                          <div className="cart-table-head">
                            <span style={{ width: "15%" }}>
                              <Checkbox
                                checked={allChecked}
                                onChange={({ target: { checked } }) =>
                                  this.checkGoods(checked)
                                }
                              >
                                全选
                              </Checkbox>
                            </span>
                            <span style={{ width: "44%" }}>商品信息</span>
                            <span style={{ width: "10%" }}>单价</span>
                            <span style={{ width: "12%" }}>数量</span>
                            <span style={{ width: "11.5%" }}>金额</span>
                            <span>操作</span>
                          </div>
                        ),
                        dataIndex: "goodsTable"
                      }
                    ]}
                    dataSource={this.renderGoods(storeList)}
                    pagination={false}
                  />
                  {storeList && storeList.length ? (
                    <div>
                      <Affix offsetBottom={10}>
                        <Row
                          type="flex"
                          justify="space-between"
                          align="middle"
                          className="balance-row"
                        >
                          <Col span={8}>
                            <Row type="flex" align="middle">
                              <Col span={6} style={{ textAlign: "center" }}>
                                <Checkbox
                                  checked={allChecked}
                                  onChange={({ target: { checked } }) =>
                                    this.checkGoods(checked)
                                  }
                                >
                                  全选
                                </Checkbox>
                              </Col>
                              <Col span={4}>
                                <Popconfirm
                                  title=">_<真的要删除这些宝贝吗？"
                                  visible={delAllVisible}
                                  okType="danger"
                                  onVisibleChange={delAllVisible => {
                                    if (!delAllVisible) {
                                      this.setState({ delAllVisible });
                                      return;
                                    }
                                    if (goodsCount > 0) {
                                      this.setState({ delAllVisible });
                                    } else {
                                      message.warning("请选择宝贝");
                                    }
                                  }}
                                  onConfirm={() => this.removeCartGoods()}
                                >
                                  <Button type="link">删除</Button>
                                </Popconfirm>
                              </Col>
                              {hasInvalid ? (
                                <Col span={8}>
                                  <Button type="link">清空已失效宝贝</Button>
                                </Col>
                              ) : null}
                            </Row>
                          </Col>
                          <Col span={10}>
                            <Row
                              type="flex"
                              justify="space-between"
                              align="middle"
                            >
                              <Col span={8}>
                                已选商品
                                <span className="selected-count">
                                  {goodsCount}
                                </span>
                                件
                              </Col>
                              <Col span={12}>
                                合计（不含运费）：{" "}
                                <span className="total-price">
                                  ￥{totalPrice}
                                </span>
                              </Col>
                              <Col span={4}>
                                <Button type="danger">结算</Button>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      </Affix>
                      <div className="wonderful-end"></div>
                    </div>
                  ) : null}
                </div>
              </Content>
            </Layout>
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
