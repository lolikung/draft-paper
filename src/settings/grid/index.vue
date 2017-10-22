<template lang="pug">
  div
    hr
    | 網格類型
    select(v-model="template")
      option(v-for="tpl in templates" :value="tpl") {{tpl.alias}}
    hr

    ul
      template(v-if="template")
        li(v-for="gridCfg in template.config")
          | {{gridCfg.alias}}
          extInput(v-model="config[gridCfg.id]" :cfg="gridCfg" @change="$emit('change')")
</template>

<script>
  let components = {
    extInput: require('./extInput.vue'),
  };

  let templates = [
    require('./template/PoundSquare'),
    require('./template/GenericSquare')
  ];

  module.exports = {
    components,
    data() {
      return {
        template: null,
        config: {
        }
      };
    },
    mounted() {
      // 設定預設網格
      this.template = templates[0];
    },
    watch: {
      // 切換網格類型後要要更新設定的欄位
      template: function( newTpl, oldTpl ) {
        // 移除舊有屬性
        for(let key of Object.keys(this.config)) {
          this.$delete(this.config, key);
        }

        // 加入新屬性
        for(let item of newTpl.config) {
          this.$set(this.config, item.id, item.default);
        }

        this.$emit('change');
      }
    },
    computed: {
      // 可用的網格名稱
      templates() {
        return templates;
      }
    }
  }
</script>
