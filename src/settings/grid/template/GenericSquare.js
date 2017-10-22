/**
 * 基本方形框
 */
class GenericSquare
{
  static get alias() {
    return '基本方格';
  }

  static get id() {
    return 'GenericSquare';
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
        default: 0.8
      },
      {
        alias: '邊框色彩',
        id: 'borderColor',
        type: 'color',
        default: '#666666'
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
   * @return {Object}
   */
  static render( scale, config ) {
    let {borderSize, borderColor, contentSize} = config;

    let canvas = document.createElement('canvas');
    borderSize = Math.round(borderSize*scale);
    canvas.width = Math.round(contentSize*scale) + borderSize*2;
    canvas.height = canvas.width;
    let ctx = canvas.getContext('2d');

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

module.exports = GenericSquare;
