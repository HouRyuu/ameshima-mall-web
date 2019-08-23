import React, { Component } from "react";
import { Row, Col, InputNumber, Button } from "antd";
import CoverImg from "./CoverImg";

export default class GoodsInfo extends Component {
  render() {
    const {
      goods: { id, name, simpleDesc, price, marketPrice, location },
      attrs,
      skus,
      coverImgs
    } = this.props;
    return (
      <Row type="flex" justify="center">
        <Col span={11}>
          <CoverImg coverImgs={coverImgs} />
        </Col>
        <Col span={11}>
          <div className="goodsName">{name}</div>
          {simpleDesc ? <p className="goodsDesc">{simpleDesc}</p> : null}
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
          <Row>
            <Col span={3}>运费</Col>
            <Col span={21}>{location}</Col>
          </Row>
          <div>
            {attrs.map(({ key, value }) => (
              <Row>
                <Col span={3}>{key}</Col>
                <Col span={21}>
                  <ul className="goodsAttrList">
                    {value.map(({ id, txtValue, imgValue }) => (
                      <li key={id}>
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
          <Row>
            <Col span={3}>数量</Col>
            <Col span={21}>
              <InputNumber min={1} defaultValue={1} />
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
