<template lang="pug">
  li
    | 列印解析度
    input(v-model.number="resoltion" type="number" min="72" max="3000" step="1" @change="$emit('change')")
</template>

<script>
  module.exports = {
    data: function() {
      return {
        resoltion: 300
      };
    }
  };
</script>
