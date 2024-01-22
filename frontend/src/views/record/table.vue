<template>
  <el-table
      class="record-table"
      :data="tableData"
      :empty-text="`${t('record.noData')}`"
      row-class-name="dashboard-table-row-class"
      v-loading="loading"
  >
    <el-table-column prop="score" :label="`${t('record.score')}`" min-width="6%" align="center"/>
    <el-table-column prop="status" :label="`${t('record.status')}`" width="75px" align="center">
      <template #default="{ row }">
        <div class="dashboard-table-column-status " v-show="row.status === 1">{{ $t('record.pass') }}</div>
        <div class="dashboard-table-column-status  border-error text-error" v-show="row.status === 2">{{ $t('record.nopass') }}</div>
        <div class="dashboard-table-column-status  border-waring text-waring" v-show="row.status === 3">错误</div>
      </template>
    </el-table-column>
    <el-table-column prop="candidateName" :label="`${t('record.username')}`" min-width="10%" align="center"/>
<!--    <el-table-column prop="phone" label="联系方式" min-width="10%" align="center" show-overflow-tooltip>
      <template #default="{row}">
        <div class="contact-box">
          <img class="dashboard-table-column-platform " :src="PhoneIcon" v-show="row.contact.type === 1"/>
          <img class="dashboard-table-column-platform " :src="WechatIcon" v-show="row.contact.type === 2"/>
          <div>{{ row?.phone }}</div>
        </div>
      </template>
    </el-table-column>-->
    <el-table-column prop="resumeAttachmentUrl" :label="`${t('record.resumePdf')}`" min-width="10%" align="center">
      <template #default="{row}">
        <a style="color: #FFFFFF" v-show="row.resumeAttachmentUrl" :href="row.resumeAttachmentUrl">
          <!-- 下载 -->
          {{ $t('record.downloadPdf') }}
        </a>
      </template>
    </el-table-column>
    <el-table-column prop="reason" :label="`${t('record.resumeReason')}`" min-width="25%" align="center">
      <template #default="{ row }">
        <div 
          class="dashboard-table-row-reason" 
          @click="() => handleCloseModal(row?.reason)"
          v-html="row?.reason?.slice?.(0, 28) + '...'">
        </div>
      </template>
    </el-table-column>

    <el-table-column prop="platform" :label="`${t('record.platform')}`" min-width="10%" align="center">
      <template #default="{ row }">
        <img class="dashboard-table-column-platform " :src="BossIcon" v-show="row.platform === 1"/>
        <img class="dashboard-table-column-platform " :src="LiepinIcon" v-show="row.platform === 2"/>
      </template>
    </el-table-column>

    <el-table-column prop="resume" :label="`${t('record.resumeShot')}`" min-width="10%" align="center">
      <template #default="{ row }">
        <Image :url="row.resumeImgUrl" @click="() => handlePreviewImage(row.resumeImgUrl)" v-show="row.resumeImgUrl"/>
      </template>
    </el-table-column>
  </el-table>
  <PreviewImage :url="previewUrl" v-if="previewUrl" @handlePreviewImageClose="handlePreviewImageClose"/>
  <Modal :text="detailText" v-show="detailText" @handleCloseModal="handleCloseModal"/>

</template>

<script>
import {defineComponent, ref, reactive, inject, watchEffect} from 'vue';
// import {ElTable, ElTableColumn, ElTooltip} from 'element-plus'
import Image from '~/components/image/index.vue'
import PreviewImage from '~/components/image/preview.vue'
import Modal from './modal.vue'
import {GLOBAL_UPDATE_MESSAGE_KEY} from '~/constants'

import BossIcon from "~/assets/icons/boss.svg"
import LiepinIcon from "~/assets/icons/liepin.svg"
import WechatIcon from "~/assets/icons/wechat.svg"
import PhoneIcon from "~/assets/icons/phone.svg"
import {Cmd, ResponseMessage} from '~/constants/MessageModel';

import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: {
    // ElTable,
    // ElTableColumn,
    Image,
    PreviewImage,
    // ElTooltip,
    Modal
  },
  props: {
    data: {
      type: Array,
      default: () => ([])
    },
    loading: {
      type: Boolean,
      default: () => false
    }
  },
  mounted() {
    nextTick(() => {
      this.handleTableAutoHeight()
    });
  },
  setup(props) {
    const { t } = useI18n()
    const previewUrl = ref('')
    const detailText = ref('')
    const tableData = reactive([])

    const handleTableAutoHeight = () => {
      if(tableData?.length === 0) return false
      const elTableContentWrapperElement = document.querySelector('.el-table__inner-wrapper');
      const elTablePageElement = document.querySelector('.dashboard-record-table-pagination');
      const dashboardMenuElement = document.querySelector('.dashboard-layout-menu');
      const parentElement = elTableContentWrapperElement.parentElement;
      parentElement.style.height = window.innerHeight - elTablePageElement.clientHeight - 200 + 'px';
      const recordTableElement = document.querySelector('.dashboard-record');
      recordTableElement.style.width = window.innerWidth - dashboardMenuElement.clientWidth - 35 + 'px';

    };

    window.addEventListener('resize', handleTableAutoHeight);
    const handlePreviewImage = (url) => {
      previewUrl.value = url
    }
    const handlePreviewImageClose = () => {
      previewUrl.value = ''
    }
    const handleCloseModal = (text = '') => {
      detailText.value = text
    }

    watchEffect(() => {
      // console.log('tableData has changed:', props.data);
      // 清空数据
      tableData.splice(0, tableData.length);
      tableData.push(...props.data)
    });


    return {
      handlePreviewImage,
      handlePreviewImageClose,
      handleCloseModal,
      handleTableAutoHeight,
      loading: props?.loading,

      previewUrl,
      detailText,
      tableData,
      
      t,

      BossIcon,
      LiepinIcon,
      WechatIcon,
      PhoneIcon
    }
  }
})

</script>
<style scoped>
.record-table{
  flex: 1;
}
</style>
