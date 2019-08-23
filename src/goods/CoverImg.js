import React, { Component } from "react";

export default class CoverImg extends Component {
  state = {};
  render() {
    const { coverImgs } = this.props;
    let { curImg } = this.state;
    if (!curImg) curImg = coverImgs[0];
    return (
      <div className="coverImg-warp">
        <div className="imgzoom-warp">
          <img alt="" src={curImg} />
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
