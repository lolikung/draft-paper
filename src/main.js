/**
 * 主程式
 */
let Vue = require('vue');
let App = Vue.extend(require('./App.vue'));

let container = document.getElementById('app');
new App({
  el: container,
});
