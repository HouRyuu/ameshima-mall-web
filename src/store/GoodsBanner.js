import React, { Component } from "react";
import { Link } from "react-router";
import { Carousel } from "antd";
import FetchUtil from "../utils/FetchUtil";
import UrlUtil from "../utils/UrlUtil";

export default class GoodsBanner extends Component {
  state = {};
  urlUtil = null;
  constructor(props) {
    super(props);
    this.urlUtil = new UrlUtil(window.location);
  }
  findBanners() {
    const {
      searchParam: { id }
    } = this.urlUtil;
    FetchUtil.get({
      url: `/goods/${id}/findBanners`,
      success: ({ data: bannerList }) => this.setState({ bannerList })
    });
  }
  componentWillMount() {
    this.findBanners();
  }
  render() {
    const { bannerList = [] } = this.state;
    return (
      <Carousel autoplay className="storeBanner-warp">
        {bannerList.map(({ goodsId, imgUrl }) => (
          <div key={goodsId}>
            <Link to={`/goods/detail?id=${goodsId}`}>
              <img className="bannerImg" alt="" src={imgUrl} />
            </Link>
          </div>
        ))}
      </Carousel>
    );
  }
}
