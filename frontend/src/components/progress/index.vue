<template>
    <Mask>
        <div class="demo-progress abs-center">
            <el-progress
                :text-inside="true"
                :stroke-width="24"
                :percentage="percentage"
                :status="status"
            />
        </div>
    </Mask>
    
</template>
<script setup>
import Mask from '~/components/mask/index.vue'
const props = defineProps({
    percentage: {
        type: Number,
        default: 0
    }
})
const status = ref(null)

watch(() => props.percentage, (newVal) => {
    if(newVal === 100) {
        status.value = 'success'
    }
})

</script>
  
<style scoped>
/* .demo-progress {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
} */
  .demo-progress .el-progress--line {
    margin-bottom: 15px;
    width: 350px;
  }
  </style>