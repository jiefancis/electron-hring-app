<template>
  <Mask>
    <div class="demo-image__lazy abs-top" style="top: auto" @scroll="handleScroll">
      <el-image-viewer
          class="image-preview"
          style="width: 100%; height: auto"
          :url-list="[url]"
          :zoom-rate="1.2"
          :max-scale="7"
          :min-scale="0.2"
          fit="scale-down"
          @close="handleClose"
      />
    </div>
  </Mask>

</template>

<script>
import {defineComponent, ref, watch, onMounted, onUnmounted} from 'vue';
import {ElImageViewer} from 'element-plus';
import Mask from '~/components/mask/index.vue'

export default defineComponent({
  components: {
    ElImageViewer,
    Mask,
  },
  props: {
    url: String
  },
  setup(props, {emit}) {
    const url = ref(props?.url)
    const scrollContainer = ref(null);
    watch(
        () => props.url,
        (newValue) => {
          url.value = newValue
        },
        {immediate: true}
    )

    const handleClose = () => {
      emit('handlePreviewImageClose')
    }

    onMounted(() => {
      console.log('scrollContainer = ',scrollContainer);
      if (scrollContainer.value) {
        scrollContainer.value.addEventListener('scroll', handleScroll);
      }
    });

    const handleScroll = () => {
      console.log(111);
    }

    onUnmounted(() => {
      if (scrollContainer.value) {
        scrollContainer.value.removeEventListener('scroll', handleScroll);
      }
    });
    return {
      handleClose,
      url,
      scrollContainer,
      handleScroll
    }
  }
})

</script>

<style scoped>
.demo-image__lazy {
  position: absolute;
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.demo-image__lazy .el-image {
  display: block;
  min-height: 200px;
  margin-bottom: 10px;
}

.demo-image__lazy .el-image:last-child {
  margin-bottom: 0;
}
.demo-image__lazy :deep( .el-image-viewer__actions){
  display: none;
}
</style>
