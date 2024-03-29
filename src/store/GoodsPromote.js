import React, {Component} from "react";
import GoodsGrid from "../components/GoodsGrid";
import {Divider, Icon} from "antd";

export default class GoodsPromote extends Component {
    convertGoodList() {
        const {goodsList = []} = this.props;
        const promoGoodsList = [];
        goodsList.forEach((item, index) => {
            if (index % 3 === 0) {
                promoGoodsList.push([]);
            }
            promoGoodsList[promoGoodsList.length - 1].push(item);
        });
        return promoGoodsList;
    }

    render() {
        const goodsList = this.convertGoodList();
        return (
            <div className="storePromote-warp">
                <Divider orientation="center" style={{fontSize: '30px', padding: '30px'}}>
                    <Icon type="heart" style={{color: '#ff0036', marginRight: '4px'}}/>
                    おすすめ
                </Divider>
                <div className="promoteList-panel">
                    {goodsList.map((goodsArray, index) => {
                        return (
                            <ul key={index} className="promoteList-line">
                                {goodsArray.map(goods => {
                                    return (
                                        <li key={goods.id} className="wonderful-item">
                                            <GoodsGrid {...goods} style={{width:320}}/>
                                        </li>
                                    );
                                })}
                            </ul>
                        );
                    })}
                </div>
                <div className="wonderful-end"></div>
            </div>
        );
    }
}
