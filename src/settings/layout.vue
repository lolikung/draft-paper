<template lang="pug">
  li
    | 邊距
    | 上
    input(v-model.number="marginTop" type="number" min="0" max="999" step="1" @change="$emit('change')")
    br
    | 左
    input(v-model.number="marginLeft" type="number" min="0" max="999" step="1" @change="$emit('change')")
    | 右
    input(v-model.number="marginRight" type="number" min="0" max="999" step="1" @change="$emit('change')")
    br
    | 下
    input(v-model.number="marginBottom" type="number" min="0" max="999" step="1" @change="$emit('change')")
</template>

<script>
  module.exports = {
    data: function() {
      return {
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        marginBottom: 10
      };
    }
  };
</script>
