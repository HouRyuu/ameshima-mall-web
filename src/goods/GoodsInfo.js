import React, { Component } from "react";
import { Row, Col, InputNumber, Button } from "antd";
import CoverImg from "./CoverImg";

export default class GoodsInfo extends Component {
  state = {
    curSku: {
      attrs: "",
      goodsCount: 1
    }
  };
  selectAttr(attrId, index) {
    let { curSku } = this.state;
    const { attrs, goodsCount } = curSku;
    const curAttrs = attrs ? attrs.split(",") : [];
    const attrIndex = curAttrs.indexOf(attrId + "");
    if (attrIndex > -1) {
      curAttrs.splice(attrIndex, 1);
    } else {
      curAttrs[index] = attrId;
    }
    const { skus } = this.props;
    const attrsStr = curAttrs.join(",");
    if (skus[0].attrs.split(",").length === curAttrs.filter(id => id).length) {
      const sku = skus.find(({ attrs }) => {
        return attrs === attrsStr;
      });
      if (sku) {
        curSku = { ...sku };
        curSku.goodsCount = goodsCount;
        this.setState({ curSku });
      }
    } else {
      const {
        goods: { price, marketPrice, quantity }
      } = this.props;
      curSku = {
        attrs: attrsStr,
        price,
        marketPrice,
        quantity
      };
      curSku.goodsCount = goodsCount;
      this.setState({ curSku });
    }
  }
  render() {
    const { goods, attrs, coverImgs } = this.props;
    const { name, simpleDesc, location } = goods;
    const {
      curSku: {
        attrs: attrsStr,
        price = goods.price,
        marketPrice = goods.marketPrice,
        quantity = goods.quantity,
        goodsCount
      }
    } = this.state;
    const attrAray = attrsStr.split(",");
    return (
      <Row type="flex" justify="center">
        <Col span={11}>
          <CoverImg coverImgs={coverImgs} />
        </Col>
        <Col span={11}>
          <div className="goodsName">{name}</div>
          {simpleDesc ? <p className="goodsDesc">{simpleDesc}</p> : null}
          {marketPrice === price ? (
            <div className="goodsPrice-warp">
              <Row type="flex" align="middle">
                <Col span={3}>价格</Col>
                <Col span={21} className="price">
                  ￥{price}
                </Col>
              </Row>
            </div>
          ) : (
            <div className="goodsPrice-warp">
              <Row>
                <Col span={3}>价格</Col>
                <Col span={21} className="marketPrice">
                  ￥{marketPrice}
                </Col>
              </Row>
              <Row type="flex" align="middle">
                <Col span={3}>促销价</Col>
                <Col span={21} className="price">
                  ￥{price}
                </Col>
              </Row>
            </div>
          )}
          <Row>
            <Col span={3}>运费</Col>
            <Col span={21}>{location}</Col>
          </Row>
          <div>
            {attrs.map(({ key, value }, index) => (
              <Row key={key}>
                <Col span={3}>{key}</Col>
                <Col span={21}>
                  <ul className="goodsAttrList">
                    {value.map(({ id, txtValue, imgValue }) => (
                      <li
                        className={
                          attrAray[index] === id + "" ? "selectedAttr" : ""
                        }
                        key={id}
                        onClick={() => this.selectAttr(id, index)}
                      >
                        {imgValue ? (
                          <img alt="" src={imgValue} />
                        ) : (
                          <span>{txtValue}</span>
                        )}
                      </li>
                    ))}
                  </ul>
                </Col>
              </Row>
            ))}
          </div>
          <Row type="flex" align="middle">
            <Col span={3}>数量</Col>
            <Col span={4}>
              <InputNumber
                min={1}
                max={quantity}
                defaultValue={1}
                value={goodsCount > quantity ? quantity : goodsCount}
                onChange={value => {
                  const { curSku } = this.state;
                  curSku.goodsCount = value;
                  this.setState({ curSku });
                }}
              />
            </Col>
            <Col offset={1} span={4} style={{ color: "#878787", fontSize: 12 }}>
              库存{quantity}件
            </Col>
          </Row>
          <Row className="bugGoods-warp">
            <Col offset={3} span={4}>
              <Button size="large">立即购买</Button>
            </Col>
            <Col offset={1} span={4}>
              <Button type="danger" size="large">
                加入购物车
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  }
}
