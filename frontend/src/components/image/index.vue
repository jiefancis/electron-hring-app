<template>
  <div class="demo-image__preview">
    <el-image
        style="width: 48px; height: 28px"
        :src="compressImageUrl"
        fit="cover"
        loading="lazy"
    />
    <!--:preview-src-list="previewSrcList"-->
  </div>
</template>

<script setup lang="ts">
import {onMounted, ref} from 'vue'
import {ElImage} from 'element-plus'


const props = defineProps({
  url: String
});
const compressImageUrl = ref(props.url);

onMounted(() => {
  compressImage(compressImageUrl.value, 0.01);
});


const compressImage = (url: string, quality: number = 0.5) => {
  const img = new Image();
  img.src = url;
  img.onload = function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (ctx) {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, img.width, img.height);
      compressImageUrl.value = canvas.toDataURL('image/jpeg', quality);
    }
  };
}


</script>
