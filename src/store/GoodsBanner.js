import React, { Component } from "react";
import { Link } from "react-router";
import { Carousel } from "antd";

export default class GoodsBanner extends Component {
  render() {
    const { goodsList = [] } = this.props;
    return (
      <Carousel autoplay className="storeBanner-warp">
        {goodsList.map(({ id, bannerUrl }) => (
          <div key={id}>
            <Link to={`/goods/detail?id=${id}`}>
              <img className="bannerImg" alt="" src={bannerUrl} />
            </Link>
          </div>
        ))}
      </Carousel>
    );
  }
}
