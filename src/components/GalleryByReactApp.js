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
const imageInfos = (function(imageDataArr) {
  return imageDataArr.map((item) => {
    item.imageURL = require('../images/' + item.fileName);
    return item;
  });
}(imageDatas));

function getRangeRandom(low, high) {
  return Math.ceil(low + Math.random() * (high - low));
}

class ImgFigure extends Component {
  render() {
    const styleObj = this.props.arrange ? this.props.arrange.pos : {};

    return (
      <figure className="img-figure" style={styleObj}>
        <img src={this.props.data.imageURL} alt={this.props.data.title} />
        <figcaption>
          <h2 className="img-title">{this.props.data.title}</h2>
        </figcaption>
      </figure>
    );
  }
}

class GalleryByReactApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imgsArrangeArr: [
        /*
        {
          pos: {
            left: '0',
            top: '0'
          }
        }
        */
      ]
    };
    this.Constant = {
      centerPos: {
        left: 0,
        right: 0
      },
      hPosRange: { // 水平方向取值范围
        leftSecX: [0, 0],
        rightSecX: [0, 0],
        y: [0, 0]
      },
      vPosRange: { // 垂直方向取值范围
        x: [0, 0],
        topY: [0, 0]
      }
    };
  }

  /**
   * 重新布局所有图片
   * @param centerIndex 指定居中哪个图片
   */
  rearrange(centerIndex) {
    const imgsArrangeArr = this.state.imgsArrangeArr;
    const Constant = this.Constant;
    const centerPos = Constant.centerPos;
    const hPosRange = Constant.hPosRange;
    const vPosRange = Constant.vPosRange;
    const hPosRangeLeftSecX = hPosRange.leftSecX;
    const hPosRangeRightSecX = hPosRange.rightSecX;
    const hPosRangeY = hPosRange.y;
    const vPosRangeTopY = vPosRange.topY;
    const vPosRangeX = vPosRange.x;

    let imgsArrangeTopArr = [];
    let topImgNum = Math.ceil(Math.random() * 2);
    let topImgSpliceIndex = 0;
    let imgsArrangeCenterArr = imgsArrangeArr.splice(centerIndex, 1);

    // 首先居中centerIndex的图片
    imgsArrangeCenterArr[0].pos = centerPos;

    // 取出要布局上侧的图片的状态信息
    topImgSpliceIndex = Math.ceil(Math.random() * (imgsArrangeArr.length - topImgNum));
    imgsArrangeTopArr = imgsArrangeArr.splice(topImgSpliceIndex, topImgNum);

    // 布局位于上侧的图片
    imgsArrangeTopArr.forEach((value, index) => {
      imgsArrangeTopArr[index].pos = {
        top: getRangeRandom(vPosRangeTopY[0], vPosRangeTopY[1]),
        left: getRangeRandom(vPosRangeX[0], vPosRangeX[1])
      }
    });

    // 布局左右两侧的图片
    for (let i = 0, j = imgsArrangeArr.length, k = j / 2; i < j; i++) {
      let hPosRangeLORX = null;

      // 前半部分布局左边，右半部分布局右边
      if (i < k) {
        hPosRangeLORX = hPosRangeLeftSecX;
      } else {
        hPosRangeLORX = hPosRangeRightSecX;
      }

      imgsArrangeArr[i].pos = {
        top: getRangeRandom(hPosRangeY[0], hPosRangeY[1]),
        left: getRangeRandom(hPosRangeLORX[0], hPosRangeLORX[1])
      };
    }

    if (imgsArrangeTopArr && imgsArrangeTopArr[0]) {
      imgsArrangeArr.splice(topImgSpliceIndex, 0, imgsArrangeTopArr[0]);
    }

    imgsArrangeArr.splice(centerIndex, 0, imgsArrangeCenterArr[0]);

    this.setState({
      imgsArrangeArr: imgsArrangeArr
    });
  }

  // 组件加载前，初始化每张图片的位置
  componentWillMount() {
    imageInfos.forEach((value, index) => {
      if (!this.state.imgsArrangeArr[index]) {
        this.setState(prevState => {
          let newImgsArrangeArr = prevState.imgsArrangeArr;
          newImgsArrangeArr[index] = {
            pos: {
              left: 0,
              top: 0
            }
          };
          return {
            imgsArrangeArr: newImgsArrangeArr
          };
        });
      }
    });
  }

  // 组件加载后，为每张图片计算其位置的范围
  componentDidMount() {

    // 首先拿到舞台的大小
    const stageDOM = ReactDOM.findDOMNode(this.refs.stage);
    const stageW = stageDOM.scrollWidth;
    const stageH = stageDOM.scrollHeight;
    const halfStageW = Math.ceil(stageW / 2);
    const halfStageH = Math.ceil(stageH / 2);

    // 拿到一个imageFigure的大小
    const imgFigureDOM = ReactDOM.findDOMNode(this.refs.imgFigure0);
    const imgW = imgFigureDOM.scrollWidth;
    const imgH = imgFigureDOM.scrollHeight;
    const halfImgW = Math.ceil(imgW / 2);
    const halfImgH = Math.ceil(imgH / 2);

    // 中心图片的位置点
    this.Constant.centerPos = {
      left: halfStageW - halfImgW,
      top: halfStageH - halfImgH
    };

    // 计算左侧、右侧区域图片排布位置的取值范围
    this.Constant.hPosRange.leftSecX[0] = -halfImgW;
    this.Constant.hPosRange.leftSecX[1] = halfStageW - halfImgW * 3;
    this.Constant.hPosRange.rightSecX[0] = halfStageW + halfImgW;
    this.Constant.hPosRange.rightSecX[1] = stageW - halfImgW;
    this.Constant.hPosRange.y[0] = -halfImgH;
    this.Constant.hPosRange.y[1] = stageH - halfImgH;

    // 计算上侧区域图片排布位置的取值范围
    this.Constant.vPosRange.topY[0] = -halfImgH;
    this.Constant.vPosRange.topY[1] = halfImgH - 3 * halfImgH;
    this.Constant.vPosRange.x[0] = halfStageW - imgW;
    this.Constant.vPosRange.x[1] = halfStageW;

    this.rearrange(0);
  }

  render() {
    const controllerUnits = [];
    const imgFigures = imageInfos.map((value, index) => (
      <ImgFigure arrange={this.state.imgsArrangeArr[index]} data={value} key={index} ref={'imgFigure' + index}/>
    ));

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

export default GalleryByReactApp;
