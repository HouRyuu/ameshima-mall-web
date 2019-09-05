import React, { Component } from "react";
import { Row, Col, InputNumber, Button, Cascader } from "antd";
import CoverImg from "./CoverImg";
import FetchUtil from "../utils/FetchUtil";

export default class GoodsInfo extends Component {
  state = {
    curSku: {
      attrs: "",
      goodsCount: 1
    },
    regionList: [],
    targetCity: {
      regionCode: ["110000", "110100"],
      regionName: "北京市",
      freight: 0
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
  findProvinces() {
    FetchUtil.get({
      url: "/basic/region/provinces",
      success: ({ data: regionList }) => {
        if (regionList) {
          this.setState({
            regionList: regionList.map(item => {
              item.isLeaf = false;
              return item;
            })
          });
        }
      }
    });
  }
  loadCities(selectedOptions) {
    const targetOption = selectedOptions[selectedOptions.length - 1];
    if (!targetOption.children) {
      targetOption.loading = true;
      const { regionCode } = targetOption;
      FetchUtil.get({
        url: `/basic/region/${regionCode}/findByParent`,
        success: ({ data }) => {
          targetOption.children = data;
          this.setState({ regionList: this.state.regionList });
        },
        complete: () => (targetOption.loading = false)
      });
    }
  }
  changeCity(value, selectedOptions) {
    const { regionName } = selectedOptions[selectedOptions.length - 1];
    const targetCity = {
      regionCode: value,
      regionName
    };
    this.setState({ targetCity }, () => this.getFreight(this.props.goods.id));
  }
  getFreight(id) {
    const { targetCity } = this.state;
    const regionCode = targetCity.regionCode[1];
    FetchUtil.get({
      url: `/goods/${id}/${regionCode}/freight`,
      success: ({ data }) => {
        targetCity.freight = data;
        this.setState({ targetCity });
      }
    });
  }
  componentWillMount() {
    this.findProvinces();
  }
  componentWillReceiveProps(props) {
    const {
      goods: { id }
    } = props;
    this.getFreight(id);
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
      },
      targetCity: { regionCode, regionName, freight },
      regionList
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
            <Col span={21}>
              {location} 至{" "}
              <Cascader
                fieldNames={{ label: "regionName", value: "regionCode" }}
                defaultValue={regionCode}
                options={regionList}
                loadData={selectedOptions => this.loadCities(selectedOptions)}
                onChange={(value, selectedOptions) =>
                  this.changeCity(value, selectedOptions)
                }
              >
                <Button type="link">{regionName}</Button>
              </Cascader>{" "}
              快递：{freight}
            </Col>
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
