import React, { Component } from "react";
import GoodsGrid from "../components/GoodsGrid";
import { Icon } from "antd";

export default class GuessLike extends Component {
  render() {
    return (
      <div className="guessLike-warp">
        <h2 className="wonderful-title">
          <span>
            <Icon type="heart" />
            猜你喜欢
          </span>
        </h2>
        <div>
          <ul className="wonderful-line">
            <li className="wonderful-item">
              <GoodsGrid goods />
            </li>
            <li className="wonderful-item">
              <GoodsGrid goods />
            </li>
            <li className="wonderful-item">
              <GoodsGrid goods />
            </li>
            <li className="wonderful-item">
              <GoodsGrid goods />
            </li>
            <li className="wonderful-item">
              <GoodsGrid goods />
            </li>
          </ul>
          <ul className="wonderful-line">
            <li className="wonderful-item">
              <GoodsGrid goods />
            </li>
            <li className="wonderful-item">
              <GoodsGrid goods />
            </li>
            <li className="wonderful-item">
              <GoodsGrid goods />
            </li>
            <li className="wonderful-item">
              <GoodsGrid goods />
            </li>
            <li className="wonderful-item">
              <GoodsGrid goods />
            </li>
          </ul>
        </div>
        <div className="wonderful-end"></div>
      </div>
    );
  }
}
