import React, { Component } from "react";
import GoodsGrid from "../components/GoodsGrid";

export default class GoodsPromote extends Component {
  render() {
    return (
      <div className="storePromote-warp">
        <div className="promote-line"></div>
        <div className="promoteList-panel">
          <ul className="promoteList-line">
            <li>
              <GoodsGrid />
            </li>
            <li>
              <GoodsGrid />
            </li>
            <li>
              <GoodsGrid />
            </li>
          </ul>
          <ul className="promoteList-line">
            <li>
              <GoodsGrid />
            </li>
            <li>
              <GoodsGrid />
            </li>
            <li>
              <GoodsGrid />
            </li>
          </ul>
          <ul className="promoteList-line">
            <li>
              <GoodsGrid />
            </li>
            <li>
              <GoodsGrid />
            </li>
            <li>
              <GoodsGrid />
            </li>
          </ul>
        </div>
        <div className="wonderful-end"></div>
      </div>
    );
  }
}
