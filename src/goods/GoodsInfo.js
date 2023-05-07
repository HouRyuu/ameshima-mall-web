import React, {Component} from "react";
import {browserHistory} from "react-router";
import {Row, Col, InputNumber, Button, Cascader, message} from "antd";
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
            regionCode: [],
            regionName: "",
            freight: 0
        },
        buyDis: false,
        addDis: false,
        attrSet: new Set()
    };

    componentWillReceiveProps(nextProps) {
        const {goods: {price, marketPrice, quantity}, skus} = nextProps;
        const {curSku} = this.state;
        if (!curSku.id) {
            curSku.price = price;
            curSku.marketPrice = marketPrice;
            curSku.quantity = quantity;
        }

        let attrSet = [];
        skus.forEach(({attrs}) => {
            attrSet = attrSet.concat(attrs.split(','));
        })
        this.setState({curSku, attrSet: new Set(attrSet)});
    }

    /**
     * 根据已选属性过滤可选属性
     * @param {*} skus
     * @param {*} attrArray 当前已选属性数组
     * * @return 可选属性set
     */
    filterSelectableAttr(skus, attrArray = []) {
        let attrsTmp, attrArray1, attrArray2;
        // 遍历已选属性，里层遍历sku属性，可选属性为当前已选属性所在行中的sku属性
        // 如当前行未选择属性，则表示sku中所有属性都可选择
        // 从sku中筛选包含当前行已选属性，则该sku中所有属性可选
        // 将每行已选属性对应的可选属性取交集，则可筛选出剩余可选属性
        attrArray.forEach((attrId, index) => {
            attrArray2 = [];
            let attrIndex;
            for (let i = 0; i < skus.length; i++) {
                let attrs = skus[i].attrs.split(',');
                attrIndex = attrs.indexOf(attrId + '');
                if (attrIndex > -1) break;
            }
            console.log(index, ',', attrIndex)
            skus.forEach(({attrs}) => {
                attrsTmp = attrs.split(',');
                attrArray2.push(attrsTmp[attrIndex]);
                if (!attrId || attrsTmp.indexOf(`${attrId}`) > -1) {
                    attrArray2 = attrArray2.concat(attrsTmp);
                }
            });
            if (index === 0) {
                attrArray1 = attrArray2;
            } else {
                attrArray1 = attrArray1.filter(id => attrArray2.indexOf(id) > -1);
            }
        })
        // 未选择任何属性时，可选属性为sku中所有属性
        if (!attrArray.length) {
            skus.forEach(({attrs}) => {
                attrArray1 = attrArray1.concat(attrs.split(','));
            })
        }
        console.log(new Set(attrArray1))
        return new Set(attrArray1);
    }

    /**
     * 选择属性时间
     * @param {*} attrId 所选属性id
     * @param {*} index 属性所在行
     * @param {*} key 属性名称
     * @param {*} value 属性值
     */
    selectAttr(attrId, index, key, value) {
        let {curSku} = this.state;
        let {attrs: attsArray, goodsCount, attrsJson} = curSku;
        attsArray[index] = attsArray.indexOf(attrId) < 0 ? attrId : undefined;
        const {skus} = this.props;
        let goods, skuId;
        if (skus[0].attrs.split(",").length === attsArray.filter(id => !!id).length) {
            let sku = skus;
            for (let i = 0; i < attsArray.length; i++) {
                sku = sku.filter(({attrs}) => attrs.split(',').indexOf(attsArray[i] + '') > -1);
            }
            if (!sku || !sku.length) {
                return;
            }
            goods = sku[0];
            skuId = goods.id;
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
        this.setState({attrSet: this.filterSelectableAttr(skus, attsArray), curSku});
    }

    findProvinces() {
        FetchUtil.get({
            url: "/basic/region/provinces",
            success: ({data}) => {
                if (data) {
                    this.setState({
                        regionList: data.map(item => {
                            item.isLeaf = false;
                            return item;
                        })
                    }, () => {
                        this.loadCities([{
                            ...data[0],
                            "isLeaf": false
                        }], true);
                    });
                }
            }
        });
    }

    loadCities(selectedOptions, defaultSelect) {
        const targetOption = selectedOptions[selectedOptions.length - 1];
        if (!targetOption.children) {
            targetOption.loading = true;
            const {regionCode} = targetOption;
            FetchUtil.get({
                url: `/basic/region/${regionCode}/findByParent`,
                success: ({data}) => {
                    targetOption.children = data;
                    this.setState({regionList: this.state.regionList}, () => {
                        if (defaultSelect) {
                            this.changeCity(
                                [targetOption.regionCode, data[0].regionCode],
                                [targetOption, data[0]]
                            );
                        }
                    });
                },
                complete: () => (targetOption.loading = false)
            });
        }
    }

    changeCity(value, selectedOptions) {
        const city = selectedOptions[1];
        const {regionName} = city;
        const {targetCity} = this.state;
        targetCity.regionCode = value;
        targetCity.regionName = regionName;
        this.setState({targetCity}, () => {
            if (city.freight === undefined) {
                this.getFreight(this.props.goods.id, targetCity, city);
            }
        });
    }

    /**
     * 根据商品id及目标城市获取运费
     * @param {*} id 商品id
     * @param {*} targetCity 目标城市
     * @param {*} city 当前选中城市
     */
    getFreight(id, targetCity, city) {
        const regionCode = targetCity.regionCode[1];
        if (!id || !regionCode) return;
        FetchUtil.post({
            url: `/goods/${regionCode}/freight`,
            data: [id],
            success: ({data}) => {
                targetCity.freight = data[id];
                this.setState({targetCity});
                if (city) { // 记录当前城市运费，下次选中时避免请求
                    city.freight = data;
                }
            }
        });
    }

    addCart() {
        const {
            curSku: {id, goodsCount, attrsJson}
        } = this.state;
        if (!id) {
            message.warn("商品を選んでください");
            return;
        }
        FetchUtil.post({
            url: "/goods/shoppingCart/add",
            data: {skuId: id, amount: goodsCount, attrsJson},
            sendBefore: () => this.setState({addDis: true}),
            success: () => {
                message.success("カートに入れました");
                const {addSuccess} = this.props;
                addSuccess();
            },
            complete: () => this.setState({addDis: false})
        });
    }

    toBuy() {
        const {
            curSku: {id, goodsCount, attrsJson}
        } = this.state;
        if (!id) {
            message.warn("商品を選んでください");
            return;
        }
        FetchUtil.put({
            url: "/goods/cacheBuySkus",
            data: [{skuId: id, amount: goodsCount, attrsJson}],
            sendBefore: () => this.setState({addDis: true}),
            success: () => {
                browserHistory.push({
                    pathname: "/order/confirm"
                });
            },
            complete: () => this.setState({addDis: false})
        });
    }

    componentWillMount() {
        this.findProvinces();
        this.getFreight(this.props.goods.id, this.state.targetCity);
    }

    getAttrClass(attrId, selectedAttr, attrSet) {
        return selectedAttr.indexOf(attrId) > -1 ? 'selectedAttr' : !attrSet.has(`${attrId}`) ? 'disabledAttr' : '';
    }

    render() {
        const {
            attrs,
            goods: {name, simpleDesc, location},
            coverImgs
        } = this.props;
        const {
            curSku: {id, attrs: attrArray, price, marketPrice, quantity, goodsCount},
            targetCity: {regionCode, regionName, freight},
            regionList,
            addDis,
            attrSet
        } = this.state;
        return (
            <Row type="flex" justify="center">
                <Col span={11}>
                    <CoverImg coverImgs={coverImgs}/></Col>
                <Col span={11}>
                    <div className="goodsName">{name}</div>
                    {simpleDesc ? <p className="goodsDesc"> {simpleDesc} </p> : null}
                    {
                        marketPrice === price ? (<div className="goodsPrice-warp">
                                <Row type="flex" align="middle">
                                    <Col span={4}>単価(税込)</Col>
                                    <Col span={20} className="price"> ¥{price}</Col>
                                </Row>
                            </div>
                        ) : (<div className="goodsPrice-warp">
                                <Row>
                                    <Col span={4}>単価(税込)</Col>
                                    <Col span={20} className="marketPrice">¥{marketPrice}</Col>
                                </Row>
                                <Row type="flex" align="middle">
                                    <Col span={4}>割引価格(税込)</Col>
                                    <Col span={20} className="price">¥{price}</Col>
                                </Row>
                            </div>
                        )
                    }
                    <Row
                        type="flex"
                        align="middle"
                        style={{marginBottom: 10, borderBottom: "1px solid #c9c9c9"}}>
                        <Col span={4}>送料</Col>
                        <Col span={20}>
                            {location}&nbsp;から
                            <Cascader
                                fieldNames={{label: "regionName", value: "regionCode"}}
                                defaultValue={regionCode}
                                options={regionList}
                                loadData={selectedOptions => this.loadCities(selectedOptions)}
                                onChange={(value, selectedOptions) =>
                                    this.changeCity(value, selectedOptions)
                                }>
                                <Button type="link">{regionName}</Button>
                            </Cascader>
                            送料：¥{freight}
                        </Col>
                    </Row>
                    <div>
                        {attrs.map(({key, value}, index) =>
                            <Row key={index}>
                                <Col span={4}>{key}</Col>
                                <Col span={20}>
                                    <ul className="goodsAttrList">
                                        {value.map(({id, txtValue, imgValue}) => {
                                            const attrClassName = this.getAttrClass(id, attrArray, attrSet);
                                            return <li className={attrClassName}
                                                       key={id}
                                                       onClick={() => {
                                                           if (attrClassName === 'disabledAttr') return;
                                                           this.selectAttr(id, index, key, txtValue);
                                                       }}>
                                                {imgValue ?
                                                    (<img alt="" src={imgValue} title={txtValue}/>)
                                                    :
                                                    (<span>{txtValue}</span>)}
                                            </li>
                                        })}
                                    </ul>
                                </Col>
                            </Row>)}
                    </div>
                    <Row type="flex" align="middle">
                        <Col span={4}>数量</Col>
                        <Col span={4}>
                            <InputNumber
                                min={1}
                                value={goodsCount > quantity ? quantity : goodsCount}
                                onChange={value => {
                                    const {curSku} = this.state;
                                    if (value < 1) {
                                        value = 1;
                                    } else if (goodsCount > quantity) {
                                        value = quantity;
                                    }
                                    curSku.goodsCount = value;
                                    this.setState({curSku});
                                }}
                            />
                        </Col>
                        <Col offset={1}
                             span={4}
                             style={{color: "#878787", fontSize: 12}}>
                            在庫 {quantity} 点
                        </Col>
                    </Row>
                    {quantity ? (<Row className="bugGoods-warp">
                        <Col offset={4}
                             span={4}>
                            <Button disabled={!id} onClick={() => this.toBuy()}>今すぐ買う</Button>
                        </Col>
                        <Col offset={1} span={4}>
                            <Button disabled={!id || addDis}
                                    type="danger"
                                    onClick={() => this.addCart()}>
                                カートに入れる
                            </Button>
                        </Col>
                    </Row>) : (<Row className="bugGoods-warp">
                        <Col offset={3} span={4}>
                            <Button disabled>売り切れ</Button>
                        </Col>
                    </Row>)}
                </Col>
            </Row>
        );
    }
}