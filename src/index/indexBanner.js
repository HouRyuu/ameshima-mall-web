import React, { Component } from "react";
import { Carousel } from "antd";

export default class IndexBanner extends Component {
  render() {
    return (
      <div className="index-banner-warp">
        <Carousel autoplay effect="fade">
          <div>
            <img
              className="bannerImg"
              alt="banner"
              src="https://img.alicdn.com/imgextra/i2/29/O1CN01eI9T9x1C5K2AkG6Yo_!!29-0-luban.jpg_q100.jpg_.webp"
            />
          </div>
          <div>
            <img
              className="bannerImg"
              alt="banner"
              src="https://img.alicdn.com/imgextra/i2/29/O1CN01eI9T9x1C5K2AkG6Yo_!!29-0-luban.jpg_q100.jpg_.webp"
            />
          </div>
          <div>
            <img
              className="bannerImg"
              alt="banner"
              src="https://img.alicdn.com/imgextra/i2/29/O1CN01eI9T9x1C5K2AkG6Yo_!!29-0-luban.jpg_q100.jpg_.webp"
            />
          </div>
          <div>
            <img
              className="bannerImg"
              alt="banner"
              src="https://img.alicdn.com/imgextra/i2/29/O1CN01eI9T9x1C5K2AkG6Yo_!!29-0-luban.jpg_q100.jpg_.webp"
            />
          </div>
        </Carousel>
      </div>
    );
  }
}
