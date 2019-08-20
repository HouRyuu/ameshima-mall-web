import React, { Component } from "react";
import { Link } from "react-router";
import { Carousel } from "antd";
import FetchUtil from "../utils/FetchUtil";

export default class IndexBanner extends Component {
  state = {};
  findBanners() {
    FetchUtil.get({
      url: "/store/index/banner",
      success: ({ data: banners }) => {
        if (banners) {
          this.setState({ banners });
        }
      }
    });
  }
  componentWillMount() {
    this.findBanners();
  }
  render() {
    const { banners = [{}] } = this.state;
    return (
      <div id="index-banner-warp" className="index-banner-warp">
        <Carousel autoplay effect="fade">
          {banners.map(({ storeId, bannerImg, bannerColor }) => (
            <div key={storeId}>
              <div style={{ backgroundColor: `#${bannerColor}` }}>
                <Link
                  to={`/store?id=${storeId}`}
                  target="_blank"
                  style={{ display: "inline-block" }}
                >
                  <img className="bannerImg" alt="" src={bannerImg} />
                </Link>
              </div>
            </div>
          ))}
        </Carousel>
      </div>
    );
  }
}
