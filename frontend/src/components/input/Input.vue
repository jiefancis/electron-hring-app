<template>
  <div class="in-input">
    <div class="in-input-label">
      <label>{{ label }}</label>
      <div class="is-require" v-if="isRequire">*</div>
      <div style="cursor: pointer;" @mouseenter="handleMouseEnter" @mouseleave="handleMouseLeave"
           class="tooltip-wrapper">
        <div class="tooltip" v-show="label.includes('打招呼') && showTooltip">打招呼时, 话术超100字自动简化！</div>
        <QuestionFilled v-show="label.includes('打招呼')"
                        style="width: 1em; height: 1em; cursor: pointer;"></QuestionFilled>
      </div>
      <!-- <el-tooltip effect="light" content="打招呼时, 话术超100字自动简化！" placement="top">
        <QuestionFilled v-show="label.includes('打招呼')" style="width: 1em; height: 1em; cursor: pointer;"></QuestionFilled>
      </el-tooltip> -->

    </div>
    <div class="in-input-text-div">
      <el-input :placeholder="placeholder" v-if="inputType==='input'" ref="input" v-model="value"
                :maxlength="textMaxLength"
      />
      <el-input :placeholder="placeholder" type="textarea" v-else ref="input" v-model="value"
                :maxlength="textMaxLength"
                :autosize="{ minRows: 5, maxRows: 50 }"
                :rows="5"
      />
      <!-- <textarea :placeholder="placeholder" v-else ref="input" v-model="value"
                :maxlength="textMaxLength"
                class="in-input-textarea"
      /> -->
      <label :class="inputType==='input'?'in-input-text-length-prompt':'in-input-textarea-length-prompt'">
        {{ value.length }}/{{ textMaxLength }}</label>
    </div>
  </div>
</template>

<script setup lang="ts">

import {computed, ref} from "vue";
import {QuestionFilled} from '@element-plus/icons-vue'
import {ElInput} from "element-plus";

const emit = defineEmits(["update:modelValue"]);

const showTooltip = ref(false)

const props = defineProps({
  inputType: {
    type: String,
    default: 'input'
  },
  label: {
    type: String,
    default: ''
  },
  isRequire: {
    type: Boolean,
    default: false
  },
  modelValue: {
    type: String,
    default: ''
  },
  textMaxLength: {
    type: Number,
    default: 18
  },
  fontSize: {
    type: String,
    default: '15px'
  },
  inputHeight: {
    type: String,
    default: '44px'
  },
  disabled: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  }
})

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  }
})

computed(() => {
  return {
    '--input-height': props.inputHeight,
  }
})

const handleMouseEnter = () => {
  showTooltip.value = true
}
const handleMouseLeave = () => {
  showTooltip.value = false
}
</script>

<style scoped>
.in-input-text {
  height: auto !important;
}

.in-input-text-div {
  width: 445px;
  position: relative;
  border-radius: 6px;
  border: 1px solid #636366;
  background: transparent;
}

.in-input-text-div:deep(.el-input__wrapper) {
  border: none;
  border-radius: 6px;
  box-shadow: none;
  resize: none;

  box-sizing: border-box;
  outline: 0;
  background: transparent;

  margin: 5px 0 5px 0;
}

.in-input-text-div :deep( .el-input__inner) {
  caret-color: #81ff00;
  color: rgba(255, 255, 255, 0.90);
  font-feature-settings: 'clig' off, 'liga' off;

  /* 中/脚注/标准 */
  font-family: PingFang SC;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px; /* 138.462% */
  letter-spacing: -0.4px;
}

.in-input-text-div :deep(.el-textarea__inner) {

  border: none;
  box-shadow: none;
  resize: none;

  box-sizing: border-box;
  outline: 0;
  background-color: #2C2C2E;

  padding: 0 60px 0 12px;
  caret-color: #81ff00;
  margin: 13px 0 13px 0;
  overflow-y: hidden;


  color: rgba(255, 255, 255, 0.90);
  font-feature-settings: 'clig' off, 'liga' off;

  /* 中/脚注/标准 */
  font-family: PingFang SC;
  font-size: 13px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px; /* 138.462% */
  letter-spacing: -0.4px;

}

.in-input-text:focus {
  outline: solid 2px #81ff00;
}

.in-input-text {
  height: auto !important;
}


.in-input-textarea {
  box-sizing: border-box;
  border: 0;
  outline: 0;
  border-radius: 8px;
  background-color: #3A3A3C;

  width: 100%;
  opacity: 0.5;
  color: #FFFFFF;

  padding: 13px 60px 0 12px;
  caret-color: var(--in-theme-color);

  resize: none;
  overflow-y: hidden;
}

.in-input-textarea:focus {
  outline: solid 2px var(--in-theme-color);
}

.in-input-text-length-prompt {
  font-size: 12px;
  color: #EBEBF5;
  opacity: 0.3;
  position: absolute;
  left: 93%;
  top: 35%;
}


.in-input-textarea-length-prompt {
  font-size: 12px;
  color: #EBEBF5;
  opacity: 0.3;
  position: absolute;
  right: 2%;
  bottom: 10%;
}


.tooltip-wrapper {
  position: relative;
  margin-left: 5px;
}

.tooltip {
  position: absolute;
  background: #fff;
  border-radius: 4px;
  color: #000;
  font-size: 12px;
  text-align: center;
  line-height: ;
  width: 190px;
  padding: 4px;
  top: -30px;
  left: 0;
}

.in-input-label {
  display: flex;
  font-size: 12px;
  text-align: left;
  flex: 1;
  margin-top: 13px;
}
.is-require {
  color: #FF453A;
}
</style>
