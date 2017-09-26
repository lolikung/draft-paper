<!-- 頁面入口點 -->
<template lang="pug">
  div#draft-main
    //- 紙張預覽
    #paper-preview
      canvas(ref="draftPaper" id="draft-paper")
    //- 設定
    #config-aside
      ul
        li
          | 紙張大小
          input(v-model.number="paper.width" type="number" min="1" max="999" step="1" value="210" @change="drawDraft")
          | x
          input(v-model.number="paper.height" type="number" min="1" max="999" step="1" value="297" @change="drawDraft")
        li
          | 邊距
          | 上
          input(v-model.number="paper.marginTop" type="number" min="0" max="999" step="1" value="10" @change="drawDraft")
          br
          | 左
          input(v-model.number="paper.marginLeft" type="number" min="0" max="999" step="1" value="10" @change="drawDraft")
          | 右
          input(v-model.number="paper.marginRight" type="number" min="0" max="999" step="1" value="10" @change="drawDraft")
          br
          | 下
          input(v-model.number="paper.marginBottom" type="number" min="0" max="999" step="1" value="10" @change="drawDraft")
        li
          | 列印解析度
          input(v-model.number="paper.resoltion" type="number" min="72" max="9999" step="1" value="300" @change="drawDraft")
      hr
      ul
        li
          | 邊框粗細
          input(v-model.number="grid.border" type="number" min="0" max="100" step="0.1" value="0.8" @change="drawDraft")
        li
          | 格子大小
          input(v-model.number="grid.contentSize" type="number" min="0" max="100" step="0.1" value="15" @change="drawDraft")
      br
      | 編輯完後請按下「產生圖片」，並在產生的圖片上按右鍵 -> 另存新檔
      br
      button(@click="generateImage") 產生圖片
      img(ref="genertateImage" id="generate-image")
</template>

<script>
module.exports = {
  data() {
    return {
      paper: {
        width: 210,
        height: 297,
        resoltion: 300,
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10
      },
      grid: {
        border: 0.8,
        contentSize: 15
      }
    };
  },
  methods: {
    drawDraft() {
      let MM_PER_INCH = 25.4;
      let DPI = this.paper.resoltion;
      let SCALE = DPI/MM_PER_INCH;
      // SCALE = 3;

      /**
       * 畫單一格子
       */
      let gridCanvas = document.createElement('canvas');
      let borderSize = Math.round(this.grid.border * SCALE);
      gridCanvas.width = Math.round(this.grid.contentSize*SCALE) + borderSize*2;
      gridCanvas.height = gridCanvas.width;
      let gridCtx = gridCanvas.getContext('2d');

      // 畫邊框
      if( borderSize > 0 ) {
        gridCtx.beginPath();
        gridCtx.lineWidth = borderSize;
        gridCtx.strokeStyle = "black";
        gridCtx.rect(borderSize/2, borderSize/2, gridCanvas.width-borderSize, gridCanvas.height-borderSize);
        gridCtx.stroke();
      }

      /**
       * 繪製稿紙
       */
      // 計算可用內容寬高
      let contentWidth = Math.floor((this.paper.width - this.paper.marginLeft - this.paper.marginRight)*SCALE);
      let contentHeight = Math.floor((this.paper.height - this.paper.marginTop - this.paper.marginBottom)*SCALE);

      // 計算可以畫幾格
      let gridRow = Math.floor(contentHeight/gridCanvas.height);
      let gridCol = Math.floor(contentWidth/gridCanvas.width);

      // 建立紙張
      let draftCanvas = document.createElement('canvas');
      draftCanvas.width = Math.round(this.paper.width * SCALE);
      draftCanvas.height = Math.round(this.paper.height * SCALE);
      let draftCtx = draftCanvas.getContext('2d');

      // 開始畫表格
      let lastPointX, lastPointY;
      for(let drawRow = 0; drawRow < gridRow; drawRow++) {
        for(let drawCol = 0; drawCol < gridCol; drawCol++) {
          let offsetX = drawCol*(gridCanvas.width-borderSize);
          let offsetY = drawRow*(gridCanvas.height-borderSize);
          lastPointX = offsetX + gridCanvas.width;
          lastPointY = offsetY + gridCanvas.height;
          draftCtx.drawImage(gridCanvas, offsetX, offsetY);
        }
      }

      // 把表格置中
      let gridDraft = draftCtx.getImageData(0, 0, lastPointX, lastPointY);
      draftCtx.clearRect(0, 0, draftCanvas.width, draftCanvas.height);
      draftCtx.putImageData(
        gridDraft,
        Math.round((draftCanvas.width-gridDraft.width)/2),
        Math.round((draftCanvas.height-gridDraft.height)/2)
      );

      // 畫好惹
      let destCanvas = this.$refs.draftPaper;
      destCanvas.width = draftCanvas.width;
      destCanvas.height = draftCanvas.height;
      let destCtx = destCanvas.getContext('2d');
      destCtx.drawImage(draftCanvas, 0, 0);
    },

    // 產生圖片
    generateImage() {
      let base64 = this.$refs.draftPaper.toDataURL();
      this.$refs.genertateImage.setAttribute('src', base64);
    }
  },
  mounted() {
    this.drawDraft();
  }
};
</script>

<style lang="sass">
  html, body
    height: 100%
  #draft-main
    display: flex
    height: 100%
  #paper-preview
    flex: 5
    background: #CCC
    text-align: center
  #draft-paper
    max-width: 100%
    max-height: 100%
    background: white
  #config-aside
    border-left: 1px solid #AAA
    flex: 3

  #generate-image
    max-width: 100%
    max-height: 100%

</style>
