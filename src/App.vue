<!-- 頁面入口點 -->
<template lang="pug">
  div#draft-main
    //- 紙張預覽
    #paper-preview
      canvas(ref="draftPaper" id="draft-paper")
    //- 設定
    #config-aside
      ul
        //- 紙張設定
        paperSettings(ref="paperSettings" @change="changeConfig")
        //- 佈局設定
        layoutSettings(ref="layoutSettings" @change="changeConfig")
        //- 輸出設定
        outputSettings(ref="outputSettings" @change="changeConfig")
        //- 格子設定
        gridSettings(ref="gridSettings" @change="changeConfig")

      br
      | 編輯完後請按下「產生圖片」，並在產生的圖片上按右鍵 -> 另存新檔
      br
      button(@click="generateImage") 產生圖片
      img(ref="genertateImage" id="generate-image")
</template>

<script>
let components = {
  paperSettings: require('./settings/paper.vue'),
  layoutSettings: require('./settings/layout.vue'),
  outputSettings: require('./settings/output.vue'),
  gridSettings: require('./settings/grid/index.vue')
};

module.exports = {
  components,
  methods: {
    changeConfig() {
      this.drawDraft();
    },
    drawDraft( dpi = 72 ) {
      console.log('draw');
      let MM_PER_INCH = 25.4;
      let scale = dpi/MM_PER_INCH;
      let gridTemplate = this.gridSettings.template;

      /**
       * 畫單一格子
       */
      let gridDraw = gridTemplate.render(scale, this.gridSettings.config);

      let borderSize = gridDraw.layout.borderTop;
      let gridCanvas = gridDraw.canvas;

      /**
       * 繪製稿紙
       */
      // 計算可用內容寬高
      let contentWidth = Math.floor((this.paperSettings.width - this.layoutSettings.marginLeft - this.layoutSettings.marginRight)*scale);
      let contentHeight = Math.floor((this.paperSettings.height - this.layoutSettings.marginTop - this.layoutSettings.marginBottom)*scale);

      // 計算可以畫幾格
      let gridCol = Math.floor(contentWidth/(gridCanvas.width-borderSize));
      let gridRow = Math.floor(contentHeight/(gridCanvas.height-borderSize));

      // 建立紙張
      let draftCanvas = document.createElement('canvas');
      draftCanvas.width = Math.round(this.paperSettings.width * scale);
      draftCanvas.height = Math.round(this.paperSettings.height * scale);
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
      this.drawDraft(this.outputSettings.resoltion);
      let base64 = this.$refs.draftPaper.toDataURL();
      this.$refs.genertateImage.setAttribute('src', base64);
    }
  },
  computed: {
    paperSettings: function() {
      return this.$refs.paperSettings.$data;
    },
    layoutSettings: function() {
      return this.$refs.layoutSettings.$data;
    },
    outputSettings: function() {
      return this.$refs.outputSettings.$data;
    },
    gridSettings: function() {
      return this.$refs.gridSettings.$data;
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
