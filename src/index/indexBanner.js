import React, { Component } from "react";
import { Carousel } from "antd";

export default class IndexBanner extends Component {
  render() {
    return (
      <div className="index-banner-warp">
        <Carousel autoplay>
          <div>
            <img
              className="bannerImg"
              alt="banner"
              src="https://img.alicdn.com/tfs/TB11I_7bND1gK0jSZFKXXcJrVXa-990-400.jpg_1080x1800Q90s50.jpg"
            />
          </div>
          <div>
            <img
              className="bannerImg"
              alt="banner"
              src="https://img.alicdn.com/tfs/TB11I_7bND1gK0jSZFKXXcJrVXa-990-400.jpg_1080x1800Q90s50.jpg"
            />
          </div>
          <div>
            <img
              className="bannerImg"
              alt="banner"
              src="https://img.alicdn.com/tfs/TB11I_7bND1gK0jSZFKXXcJrVXa-990-400.jpg_1080x1800Q90s50.jpg"
            />
          </div>
          <div>
            <img
              className="bannerImg"
              alt="banner"
              src="https://img.alicdn.com/tfs/TB11I_7bND1gK0jSZFKXXcJrVXa-990-400.jpg_1080x1800Q90s50.jpg"
            />
          </div>
        </Carousel>
      </div>
    );
  }
}
