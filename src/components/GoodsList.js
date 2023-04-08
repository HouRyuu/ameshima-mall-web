import React, { Component } from "react";
import GoodsGrid from "../components/GoodsGrid";

export default class GoodsList extends Component {
  convertData() {
    const { goodsList = [], num = 5 } = this.props;
    let goodsLines = [];
    goodsList.forEach((item, index) => {
      if (index % num === 0) {
        goodsLines.push([]);
      }
      goodsLines[goodsLines.length - 1].push(item);
    });
    return goodsLines;
  }
  render() {
    const goodsLines = this.convertData();
    return (
      <div>
        {goodsLines.map((goodsArray, index) => {
          return (
            <ul key={index} className="wonderful-line">
              {goodsArray.map((goods) => {
                return (
                  <li key={goods.id} className="wonderful-item">
                    <GoodsGrid {...goods} />
                  </li>
                );
              })}
            </ul>
          );
        })}
      </div>
    );
  }
}
