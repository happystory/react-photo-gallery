/**
 * Created by liuyao on 17/4/15.
 */
import React, {Component} from 'react';
import ReactDOM from 'react-dom';

// 获取图片相关数据
import imageDatas from '../data/imageDatas.json';

// 引入样式
import '../styles/main.scss';

// 利用自执行函数，将图片名信息转成图片URL路径信息
let imageInfos = (function(imageDataArr) {
  return imageDataArr.map((item) => {
    item.imageURL = require('../images/' + item.fileName);
    return item;
  });
}(imageDatas));
console.log(imageInfos);

class ImgFigure extends Component {
  render() {
    return (
      <figure className="img-figure">
        <img src={this.props.data.imageURL} alt={this.props.data.title} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
}

class GalleryApp extends Component {
  constructor(props) {
    super(props);
    this.state = {

    };
    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: {
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: {
        x: [0, 0],
        topY: [0, 0]
      }
    }
  }

  // 组件加载后，为每张图片计算其位置的范围
  componentDidMount() {

    // 首先拿到舞台的大小
    let stageDOM = ReactDOM.findDOMNode(this.refs.stage);
    let stageW = stageDOM.scrollWidth;
    let stageH = stageDOM.scrollHeight;
    let halfStageW = Math.ceil(stageW / 2);
    let halfStageH = Math.ceil(stageH / 2);
    console.log(halfStageW, halfStageH);

    // 拿到一个imageFigure的大小
    let imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
    let imgW = imgFigureDOM.scrollWidth;
    let imgH = imgFigureDOM.scrollHeight;
    let halfImgW = Math.ceil(imgW / 2);
    let halfImgH = Math.ceil(imgH / 2);

    // 中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    }
  }

  render() {
    let controllerUnits = [];
    let imgFigures = [];
    imageDatas.forEach((value, index) => {
      imgFigures.push(<ImgFigure data={value} key={index} ref={'imgFigure' + index} />);
    });

    return (
      <section className="stage" ref="stage">
        <section className="img-sec">
          {imgFigures}
        </section>
        <nav className="controller-nav">
          {controllerUnits}
        </nav>
      </section>
    );
  }
}

export default GalleryApp;
