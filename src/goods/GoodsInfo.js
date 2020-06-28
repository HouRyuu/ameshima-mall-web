import React, { Component } from "react";
import { browserHistory } from "react-router";
import { Row, Col, InputNumber, Button, Cascader, message } from "antd";
import CoverImg from "./CoverImg";
import FetchUtil from "../utils/FetchUtil";

export default class GoodsInfo extends Component {
    state = {
        attrs: [],
        curSku: {
            attrs: [],
            goodsCount: 1,
            price: 0,
            marketPrice: 0,
            quantity: 0,
            attrsJson: "{}"
        },
        regionList: [],
        targetCity: {
            regionCode: ["110000", "110100"],
            regionName: "北京市",
            freight: -1
        },
        buyDis: false,
        addDis: false,
        attrSet: new Set()
    };
    componentWillReceiveProps(nextProps) {
        const { goods: { price, marketPrice, quantity }, skus } = nextProps;
        const { curSku } = this.state;
        if (!curSku.id) {
            curSku.price = price;
            curSku.marketPrice = marketPrice;
            curSku.quantity = quantity;
        }

        let attrSet = [];
        skus.forEach(({ attrs }) => {
            attrSet = attrSet.concat(attrs.split(','));
        })
        this.setState({ curSku, attrSet: new Set(attrSet) });
    }
    filterSelectbleAttr(attrArray = []) {
        const { skus } = this.props;
        let attrId, attrsTmp, attrArray1 = [], attrArray2;
        for (let index = 0; index < attrArray.length; index++) {
            attrId = attrArray[index];
            attrArray2 = [];
            skus.forEach(({ attrs }) => {
                attrsTmp = attrs.split(',');
                attrArray2.push(attrsTmp[index]);
                if (!attrId || attrsTmp.indexOf(`${attrId}`) > -1) {
                    attrArray2 = attrArray2.concat(attrsTmp);
                }
            });
            if (index === 0) {
                attrArray1 = attrArray2;
            } else {
                attrArray1 = attrArray1.filter(id => attrArray2.indexOf(id) > -1);
            }
        }
        if (!attrArray.length) {
            skus.forEach(({ attrs }) => {
                attrArray1 = attrArray1.concat(attrs.split(','));
            })
        }
        return new Set(attrArray1);
    }
    selectAttr(attrId, index, key, value) {
        let { curSku } = this.state;
        let { attrs: attsArray, goodsCount, attrsJson } = curSku;
        attsArray[index] = attsArray.indexOf(attrId) < 0 ? attrId : undefined;
        const { skus } = this.props;
        let goods;
        let skuId;
        if (skus[0].attrs.split(",").length === attsArray.filter(id => !!id).length) {
            const attrsStr = attsArray.join(',');
            const sku = skus.find(({ attrs }) => attrs === attrsStr);
            if (!sku) {
                return;
            }
            goods = sku;
            skuId = sku.id;
        } else {
            goods = this.props.goods;
        }
        const attrsJsonObj = JSON.parse(attrsJson);
        attrsJsonObj[key] = value;
        curSku = {
            id: skuId,
            attrs: attsArray,
            goodsCount,
            attrsJson: JSON.stringify(attrsJsonObj),
            price: goods.price,
            marketPrice: goods.marketPrice,
            quantity: goods.quantity
        }
        this.setState({ attrSet: this.filterSelectbleAttr(attsArray), curSku });
    }
    findProvinces() {
        FetchUtil.get({
            url: "/basic/region/provinces",
            success: ({ data }) => {
                if (data) {
                    this.setState({
                        regionList: data.map(item => {
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
        const city = selectedOptions[1];
        const { regionName } = city;
        const { targetCity } = this.state;
        targetCity.regionCode = value;
        targetCity.regionName = regionName;
        this.setState({ targetCity }, () => {
            if (city.freight === undefined) {
                this.getFreight(this.props.goods.id, targetCity, city);
            }
        });
    }
    getFreight(id, targetCity, city) {
        if (!id) return;
        const regionCode = targetCity.regionCode[1];
        FetchUtil.get({
            url: `/goods/${id}/${regionCode}/freight`,
            success: ({ data }) => {
                targetCity.freight = data;
                this.setState({ targetCity });
                if (city) {
                    city.freight = data;
                }
            }
        });
    }
    addCart() {
        const {
            curSku: { id, goodsCount, attrsJson }
        } = this.state;
        if (!id) {
            message.warn("请选择您要的商品信息");
            return;
        }
        FetchUtil.post({
            url: "/goods/shoppingCart/add",
            data: { skuId: id, amount: goodsCount, attrsJson },
            sendBefore: () => this.setState({ addDis: true }),
            success: ({ errCode, errMsg }) => {
                if (!errCode) {
                    message.success("成功添加至购物车");
                    const { addSuccess } = this.props;
                    addSuccess();
                    return;
                }
                message.error(errMsg, () => {
                    if (errCode === 201 || errCode === 202) {
                        browserHistory.push({
                            pathname: "/login",
                            search: `?redirectURL=${escape(window.location)}`
                        });
                    }
                });
            },
            complete: () => this.setState({ addDis: false })
        });
    }
    componentWillMount() {
        this.findProvinces();
        this.getFreight(this.props.goods.id, this.state.targetCity);
    }
    getAttrClass(attrId, selectedAttr, attrSet) {
        if (selectedAttr.indexOf(attrId) > -1) {
            return 'selectedAttr';
        }
        if (!attrSet.has(`${attrId}`)) {
            return 'disabledAttr';
        }
        return '';
    }
    render() {
        const {
            attrs,
            goods: { name, simpleDesc, location },
            coverImgs
        } = this.props;
        const {
            curSku: { attrs: attrArray, price, marketPrice, quantity, goodsCount },
            targetCity: { regionCode, regionName, freight },
            regionList,
            addDis,
            attrSet
        } = this.state;
        return (
            <Row type="flex" justify="center">
                <Col span={11}>
                    <CoverImg coverImgs={coverImgs} /></Col>
                <Col span={11}>
                    <div className="goodsName">{name}</div>
                    {simpleDesc ? < p className="goodsDesc" > {simpleDesc} </p> : null}
                    {
                        marketPrice === price ? (<div className="goodsPrice-warp">
                            <Row type="flex" align="middle" >
                                <Col span={3}>价格</Col>
                                <Col span={21} className="price"> ￥{price}</Col>
                            </Row>
                        </div>
                        ) : (<div className="goodsPrice-warp" >
                            <Row >
                                <Col span={3}>价格</Col>
                                <Col span={21} className="marketPrice">￥{marketPrice}</Col>
                            </Row>
                            <Row type="flex" align="middle">
                                <Col span={3}>促销价</Col>
                                <Col span={21} className="price">￥{price}</Col>
                            </Row>
                        </div>
                            )
                    }
                    <Row
                        type="flex"
                        align="middle"
                        style={{ marginBottom: 10, borderBottom: "1px solid #c9c9c9" }} >
                        <Col span={3}>运费</Col>
                        <Col span={21}>
                            {location}  至
                            <Cascader
                                fieldNames={{ label: "regionName", value: "regionCode" }}
                                defaultValue={regionCode}
                                options={regionList}
                                loadData={selectedOptions => this.loadCities(selectedOptions)}
                                onChange={(value, selectedOptions) =>
                                    this.changeCity(value, selectedOptions)
                                }>
                                <Button type="link">{regionName}</Button>
                            </Cascader>
                            快递：{freight}
                        </Col>
                    </Row>
                    <div>
                        {attrs.map(({ key, value }, index) =>
                            <Row key={key}>
                                <Col span={3}>{key}</Col>
                                <Col span={21}>
                                    <ul className="goodsAttrList">
                                        {value.map(({ id, txtValue, imgValue }) => {
                                            const attrClassName = this.getAttrClass(id, attrArray, attrSet);
                                            return <li className={attrClassName}
                                                key={id}
                                                onClick={() => {
                                                    if (attrClassName === 'disabledAttr') {
                                                        return;
                                                    }
                                                    this.selectAttr(id, index, key, txtValue);
                                                }}>
                                                {imgValue ? (<img alt=""
                                                    src={imgValue}
                                                    title={txtValue}
                                                />
                                                ) : (<span>{txtValue}</span>)
                                                }
                                            </li>
                                        }
                                        )}
                                    </ul>
                                </Col>
                            </Row>
                        )}
                    </div>
                    <Row type="flex" align="middle">
                        <Col span={3}>数量</Col>
                        <Col span={4}>
                            <InputNumber
                                min={1}
                                max={quantity}
                                value={goodsCount > quantity ? quantity : goodsCount}
                                onChange={value => {
                                    const { curSku } = this.state;
                                    if (value < 1) {
                                        value = 1;
                                    } else if (goodsCount > quantity) {
                                        value = quantity;
                                    }
                                    curSku.goodsCount = value;
                                    this.setState({ curSku });
                                }}
                            />
                        </Col>
                        <Col offset={1}
                            span={4}
                            style={{ color: "#878787", fontSize: 12 }} >
                            库存 {quantity} 件
                        </Col>
                    </Row>
                    {quantity ? (<Row className="bugGoods-warp">
                        <Col offset={3}
                            span={4} >
                            <Button size="large">立即购买</Button>
                        </Col>
                        <Col offset={1} span={4}>
                            <Button disabled={addDis}
                                type="danger"
                                size="large"
                                onClick={() => this.addCart()} >
                                加入购物车
                            </Button>
                        </Col>
                    </Row>
                    ) : (<Row className="bugGoods-warp">
                        <Col offset={3} span={4}>
                            <Button disabled size="large">
                                宝贝已经卖光啦
                                </Button>
                        </Col>
                    </Row>)
                    }
                </Col>
            </Row >
        );
    }
}