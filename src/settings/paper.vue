<template lang="pug">
  li
    | 紙張大小
    input(v-model.number="width" type="number" min="1" max="999" step="1" @change="$emit('change')")
    | x
    input(v-model.number="height" type="number" min="1" max="999" step="1" @change="$emit('change')")
</template>

<script>
  module.exports = {
    data: function() {
      return {
        width: 210,
        height: 297
      };
    }
  };
</script>
