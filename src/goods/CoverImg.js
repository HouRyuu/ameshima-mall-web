import React, { Component } from "react";

export default class CoverImg extends Component {
  state = {
    imagezoomStyle: {
      display: "none"
    },
    bigImgWarpStyle: {
      display: "none"
    },
    bigImgStyle: {}
  };
  showBigImg(e) {
    const { clientX, clientY, currentTarget } = e;
    const rect = currentTarget.getBoundingClientRect();
    const left = rect.left - document.documentElement.clientLeft;
    const top = rect.top - document.documentElement.clientTop;
    const offx = clientX - left;
    const offy = clientY - top;
    let mx = offx - 218.4 / 2;
    let my = offy - 218.4 / 2;
    if (mx < 0) {
      mx = 0;
    }
    if (mx > 420 - 218.4) {
      mx = 420 - 218.4;
    }
    if (my < 0) {
      my = 0;
    }
    if (my > 420 - 218.4) {
      my = 420 - 218.4;
    }
    const imagezoomStyle = {
      display: "block",
      left: mx,
      top: my
    };
    const bigImgWarpStyle = { display: "block" };
    let bx = -(800 / 420) * mx;
    let by = -(800 / 420) * my;
    const bigImgStyle = {
      left: bx,
      top: by
    };
    this.setState({ imagezoomStyle, bigImgWarpStyle, bigImgStyle });
  }
  render() {
    const { coverImgs } = this.props;
    let { curImg, imagezoomStyle, bigImgWarpStyle, bigImgStyle } = this.state;
    if (!curImg) curImg = coverImgs[0];
    return (
      <div className="coverImg-warp">
        <div
          className="imgzoom-warp"
          id="imgzoomWarp"
          onMouseOut={() => {
            const hide = {
              display: "none"
            };
            this.setState({ imagezoomStyle: hide, bigImgWarpStyle: hide });
          }}
          onMouseMove={e => this.showBigImg(e)}
        >
          <img alt="" src={curImg} />
          <div className="ks-imagezoom-lens" style={imagezoomStyle}></div>
          <div className="ks-imagezoom-viewer" style={bigImgWarpStyle}>
            <img alt="" src={curImg} style={bigImgStyle} />
          </div>
        </div>
        <ul className="coverImg-list">
          {coverImgs.map(img => (
            <li key={img} onMouseOver={() => this.setState({ curImg: img })}>
              <img alt="" src={img} />
            </li>
          ))}
        </ul>
      </div>
    );
  }
}
