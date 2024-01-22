<template>
  <div ref="messageRef" class="dashboard-message">
    <div :class="[
            'dashboard-message-content',
            props.type ==='success' ? 'success' :'warning'
        ]">
      <img class="dashboard-message-content-icon" :src="SuccessIcon" v-if="props.type ==='success'"/>
      <img class="dashboard-message-content-icon" :src="WarningIcon" v-if="props.type==='warning'"/>
      <div style="flex: 1; white-space: nowrap;">
        {{ props.message }}

        <a class="jump-url" target="_blank" v-if="props.jumpUrl"
           :href="props.jumpUrl">去更新({{ tipTimeout }}s)</a>

        <a class="jump-url" v-if="props.isClick" style="color: #399CFF;"
           :href="props.jumpUrl" @click="emitClick">去更新({{ tipTimeout }}s)</a>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {defineProps, onMounted, ref} from 'vue'
import anime from 'animejs/lib/anime.es.js';
import SuccessIcon from "~/assets/icons/success-icon.svg"
import WarningIcon from "~/assets/icons/warning-icon.svg"

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  message: {
    type: String,
    default: ''
  },
  details: {
    type: String,
    default: ''
  },
  jumpUrl: {
    type: String,
    default: ''
  },
  isClick: {
    type: Boolean,
    default: false
  },
  duration: {
    type: Number,
    default: 3000
  }
})

const messageRef = ref(null);
const tipTimeout = ref(0);

const emits = defineEmits(['handleClick'])

onMounted(() => {
  timeJumpUrl();
  anime({
    targets: messageRef.value,
    opacity: [0, 1],
    translateX: '-50%',
    translateY: [-50, 0],
    easing: 'easeOutExpo',
    duration: 500
  });
  setTimeout(() => {
    anime({
      targets: messageRef.value,
      opacity: [1, 0],
      translateX: '-50%',
      translateY: [0, -50],
      easing: 'easeInExpo',
      duration: 500
    });

  }, props.duration);
});

const emitClick = () => {
  emits('handleClick')
}
const timeJumpUrl = () => {
  tipTimeout.value = props.duration / 1000;
  const timer = setInterval(() => {
    tipTimeout.value--;
    if (tipTimeout.value === 0) {
      clearInterval(timer);
    }
  }, 1000);
}

</script>

<style scoped>
.jump-url{
  cursor: pointer;
}
</style>