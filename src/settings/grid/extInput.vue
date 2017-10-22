<!--
  輸入框
-->
<template lang="pug">
  input(v-if="cfg.type == 'number'" type="number" :name="cfg.id" v-model.number="value")
  input(v-else-if="cfg.type == 'color'" type="color" :name="cfg.id" v-model="value")
</template>

<script>
module.exports = {
  model: {
    prop: 'value',
    event: 'change'
  },
  props: ["cfg"],
  data: function() {
    return {
      value: this.cfg.default
    };
  },
  watch: {
    value: function( value ) {
      this.$emit('change', value);
    }
  },
  mounted() {
    // 塞屬性用
    if( this.cfg.hasOwnProperty('attr') ) {
      let attrs = Object.keys(this.cfg.attr);
      let element = this.$el;
      attrs.map( attrName => {
        if(element[attrName] !== undefined) {
          element[attrName] = this.cfg.attr[attrName];
        }
      });
    }
  }
};
</script>
