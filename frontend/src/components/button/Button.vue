<template>
  <div class="in-btn">
    <label ref="btn">{{ props.text }}</label>
  </div>
</template>

<script setup lang="ts">

import {ComponentInternalInstance, getCurrentInstance, onMounted, watch} from "vue";

let currentInstance = getCurrentInstance() as ComponentInternalInstance;
const props = defineProps({
  text: {
    type: String,
    default: ''
  },
  disabled: {
    type: Boolean,
    default: false
  },
  fontColor: {
    type: String,
    default: '#EBEBF5'
  },
  fontSize: {
    type: String,
    default: '15px'
  }
})

onMounted(() => {
  let btn: HTMLDivElement = currentInstance.refs.btn as HTMLDivElement;
  btn.style.fontSize = props.fontSize;
  if (props.disabled) {
    btn.style.opacity = '0.3';
    btn.style.cursor = '';
    btn.style.color = '#EBEBF5';
  } else {
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
    btn.style.color = props.fontColor;
  }
});

watch(() => props.fontSize, (newVal) => {
  let btn: HTMLDivElement = currentInstance.refs.btn as HTMLDivElement;
  btn.style.fontSize = newVal;
});

watch(() => props.disabled, (newVal) => {
  let btn: HTMLDivElement = currentInstance.refs.btn as HTMLDivElement;
  if (newVal) {
    btn.style.opacity = '0.3';
    btn.style.cursor = 'not-allowed';
    btn.style.color = '#EBEBF5';
  } else {
    btn.style.opacity = '1';
    btn.style.cursor = 'pointer';
    btn.style.color = props.fontColor;
  }
});

watch(() => props.fontColor, (newVal) => {
  let btn: HTMLDivElement = currentInstance.refs.btn as HTMLDivElement;
  btn.style.color = newVal;
});

</script>
<style scoped>
.in-btn {
}
</style>
