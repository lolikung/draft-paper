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
          input(v-model.number="paper.width" type="number" min="1" max="999" step="1" value="210" @change="changeConfig")
          | x
          input(v-model.number="paper.height" type="number" min="1" max="999" step="1" value="297" @change="changeConfig")
        li
          | 邊距
          | 上
          input(v-model.number="paper.marginTop" type="number" min="0" max="999" step="1" value="10" @change="changeConfig")
          br
          | 左
          input(v-model.number="paper.marginLeft" type="number" min="0" max="999" step="1" value="10" @change="changeConfig")
          | 右
          input(v-model.number="paper.marginRight" type="number" min="0" max="999" step="1" value="10" @change="changeConfig")
          br
          | 下
          input(v-model.number="paper.marginBottom" type="number" min="0" max="999" step="1" value="10" @change="changeConfig")
        li
          | 列印解析度
          input(v-model.number="paper.resoltion" type="number" min="72" max="9999" step="1" value="300" @change="changeConfig")
      hr
      | 網格類型
      select
        option(v-for="item in gridLayoutItems" value="item") {{item}}
      ul
        li
          | 邊框粗細
          input(v-model.number="grid.border" type="number" min="0" max="100" step="0.1" value="0.8" @change="changeConfig")
        li
          | 邊框色彩
          input(v-model="grid.borderColor" type="color" @change="changeConfig")
        li
          | 格子大小
          input(v-model.number="grid.contentSize" type="number" min="0" max="999" step="0.1" value="15" @change="changeConfig")
      br
      | 編輯完後請按下「產生圖片」，並在產生的圖片上按右鍵 -> 另存新檔
      br
      button(@click="generateImage") 產生圖片
      img(ref="genertateImage" id="generate-image")
</template>

<script>
let gridLayout = [
  require('./grid/GenericSquare')
];
let GenericSquare = gridLayout[0];

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
        contentSize: 15,
        borderColor: '#333'
      }
    };
  },
  methods: {
    changeConfig() {
      this.drawDraft();
    },
    drawDraft( dpi = 72 ) {
      let MM_PER_INCH = 25.4;
      let scale = dpi/MM_PER_INCH;

      /**
       * 畫單一格子
       */
      let gridDraw = GenericSquare.render(scale, {
        borderColor: this.grid.borderColor,
        borderSize: this.grid.border,
        contentSize: this.grid.contentSize
      });

      let borderSize = gridDraw.layout.borderTop;
      let gridCanvas = gridDraw.canvas;

      /**
       * 繪製稿紙
       */
      // 計算可用內容寬高
      let contentWidth = Math.floor((this.paper.width - this.paper.marginLeft - this.paper.marginRight)*scale);
      let contentHeight = Math.floor((this.paper.height - this.paper.marginTop - this.paper.marginBottom)*scale);

      // 計算可以畫幾格
      let gridCol = Math.floor(contentWidth/(gridCanvas.width-borderSize));
      let gridRow = Math.floor(contentHeight/(gridCanvas.height-borderSize));

      // 建立紙張
      let draftCanvas = document.createElement('canvas');
      draftCanvas.width = Math.round(this.paper.width * scale);
      draftCanvas.height = Math.round(this.paper.height * scale);
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
      this.drawDraft(this.paper.resoltion);
      let base64 = this.$refs.draftPaper.toDataURL();
      this.$refs.genertateImage.setAttribute('src', base64);
    }
  },
  mounted() {
    this.drawDraft();
  },
  computed: {
    // 可用的網格名稱
    gridLayoutItems() {
      return gridLayout.map( grid => {
        return grid.alias;
      });
    }
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
