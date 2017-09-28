/**
 * 井字格
 */
class PoundSquare
{
  static get alias() {
    return '井字格';
  }

  static get id() {
    return 'PoundGrid';
  }

  static get config() {
    return [
      {
        alias: '格子大小(mm)',
        id: 'contentSize',
        type: 'number',
        attr: {
          min: 0,
          max: 9990,
          step: 0.1,
        },
        default: 15
      },
      {
        alias: '邊框粗細(mm)',
        id: 'borderSize',
        type: 'number',
        attr: {
          min: 0,
          max: 100,
          step: 0.1,
        },
        default: 0.6
      },
      {
        alias: '邊框色彩',
        id: 'borderColor',
        type: 'color',
        default: '#888888'
      },
      {
        alias: '邊框粗細(mm)',
        id: 'contentBorderSize',
        type: 'number',
        attr: {
          min: 0,
          max: 100,
          step: 0.1,
        },
        default: 0.2
      },
      {
        alias: '格線色彩',
        id: 'contentBorderColor',
        type: 'color',
        default: '#AAAAAA'
      }
    ];
  }

  /**
   * 畫格子
   * @param  {Number} scale 輸出向量
   * @param  {Object} config 設定值
   * @param  {Number} config.borderSize 格線寬度
   * @param  {String} config.borderColor 邊框色彩
   * @param  {Number} config.contentSize 內容框大小
   * contentBorderSize
   * contentBorderColor
   * @return {Object}
   */
  static render( scale, config ) {
    let borderSize = Math.round(config.borderSize*scale);
    let borderColor = config.borderColor;
    let contentSize = Math.round(config.contentSize*scale);
    let contentBorderSize = Math.round(config.contentBorderSize*scale);
    let contentBorderColor = config.contentBorderColor;

    let canvasSize = contentSize + borderSize*2;
    let canvas = document.createElement('canvas');
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    let ctx = canvas.getContext('2d');

    // 畫內框
    if(contentBorderSize > 0) {
      let drawLinePos = [ /*[ fromX, fromY, toX, toY ]*/ ];
      let step = contentSize/3;
      for(let i = 1; i <= 2; i++) {
        let linePos = Math.round(step*i - contentBorderSize/2)+borderSize;
        drawLinePos.push([0, linePos, canvasSize, linePos]);
        drawLinePos.push([linePos, 0, linePos, canvasSize]);
      }
      ctx.lineWidth = contentBorderSize;
      ctx.strokeStyle = contentBorderColor;
      drawLinePos.map( pos => {
        ctx.beginPath();
        ctx.moveTo(pos[0], pos[1]);
        ctx.lineTo(pos[2], pos[3]);
        ctx.stroke();
      });
    }

    // 畫邊框
    if( borderSize > 0 ) {
      ctx.beginPath();
      ctx.lineWidth = borderSize;
      ctx.strokeStyle = borderColor;
      ctx.rect(borderSize/2, borderSize/2, canvas.width-borderSize, canvas.height-borderSize);
      ctx.stroke();
    }

    return {
      layout: {
        borderTop: borderSize,
        borderLeft: borderSize,
        borderRight: borderSize,
        borderBottom: borderSize,
      },
      canvas: canvas
    };
  };
}

module.exports = PoundSquare;
