import React, { Component } from "react";
import { Card, Icon } from "antd";

const brandList = [
  {
    id: 1,
    name: "鬼冢虎",
    imgUrl:
      "//img.alicdn.com/i2/2/TB1TNGdmv2H8KJjy1zkXXXr7pXa?abtest=&pos=70&abbucket=&acm=09042.1003.1.1200415&scm=1007.13029.131809.100200300000000_125x125q100.jpg_.webp"
  }
];
export default class BrandPromote extends Component {
  render() {
    return (
      <Card className="brandPromote-warp">
        {brandList.map(item => (
          <Card.Grid key={item.id} className="brand-item">
            <div className="brand-img">
              <img src={item.imgUrl} />
            </div>
            <a
              className="brand-mask"
              rel="noopener noreferrer"
              href={`/brand/index?id=${item.id}`}
            >
              <div className="brandName">
                <span>{item.name}</span>
              </div>
              <div className="enter">点击进入</div>
            </a>
          </Card.Grid>
        ))}
        <Card.Grid className="brand-item refresh-btn">
          <Icon type="sync" />
          <span>换一批</span>
        </Card.Grid>
      </Card>
    );
  }
}
