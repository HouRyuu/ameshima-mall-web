import React, { Component } from "react";
import { Link } from "react-router";
import { Carousel } from "antd";
import { fetchUtil } from "../utils/FetchUtil";

export default class IndexBanner extends Component {
  state = {};
  findBanners() {
    fetchUtil({
      url: "/store/index/banner",
      callback: ({ data: banners }) => {
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
    const { banners = [] } = this.state;
    return (
      <div id="index-banner-warp" className="index-banner-warp">
        <Carousel
          autoplay
          effect="fade"
          beforeChange={(
            from,
            to // 异步事件会导致无法手动切换banner
          ) =>
            (document.getElementById(
              "index-banner-warp"
            ).style.backgroundColor = `#${banners[to].bannerColor}`)
          }
        >
          {banners.map(({ storeId, bannerImg }) => (
            <div key={storeId}>
              <Link to={`/store/${storeId}`}>
                <img className="bannerImg" alt="banner" src={bannerImg} />
              </Link>
            </div>
          ))}
        </Carousel>
      </div>
    );
  }
}
