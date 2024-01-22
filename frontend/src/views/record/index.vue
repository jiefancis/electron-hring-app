<template>
  <div class="dashboard-record">
    <div class="dashboard-record-filter">
      <div class="dashboard-record-filter-tabs">
        <div
          @click="() => handleSelectTab(index)"
          v-for="(tab, index) in tabList"
          :key="index"
          :class="[
            'dashboard-record-filter-tab',
            tabActiveIndex === index ? 'dashboard-record-filter-tab-active' : ''
          ]"
        >{{ tab.name }}
        </div>
      </div>
      <div :class="[
                      'dashboard-record-filter-tab',
                      tabActiveIndex >= 6 ? 'dashboard-record-filter-tab-active' : ''
                  ]" style="width: 16px; height: 16px; cursor: pointer; position: relative;">
        <img v-show="expandTabList.length > 0"
              @click="handleExpandMoreJob"
              :src="ExpandMoreIcon"
              style="width: 16px; height: 16px; cursor: pointer;"
        />
        <Menu ref="JobMenuRef" :defaultValue="-1" :menuList="expandTabList" v-if="isShowFilterJob"
              @select="handleSelectJob"/>
      </div>
      <div class="dashboard-record-filter-list">
        <div class="search-box">
          <div  class="search-icon" v-if="!searchExpended" @click="expendSearch(true)">
            <img :src="SearchIcon"/>
          </div>
          <el-autocomplete
            v-else 
            v-model="searchStr" 
            placeholder="搜索"
            :fetch-suggestions="searchSuggest"
            class="search-input"
            @select="selectSuggest"
            select-when-unmatched>
            <template #prefix>
                <img :src="SearchIcon" class="input-search-icon" @click="expendSearch(false)"/>
            </template>
          </el-autocomplete>
        </div>
        <div class="dashboard-record-filter-item" @click="handleFilterClock">
          <div>{{ clockText }}</div>
          <img :src="ClockIcon"/>
          <Menu ref="clockMenuRef"
                :defaultValue="3"
                :menuList="menuClockList" v-show="isShowFilterClock" @select="handleSelectClock"/>
        </div>
        <div class="dashboard-record-filter-item" @click="handleFilterStatus">
          <span>{{ statusText }}</span>
          <img :src="ExpandIcon"/>
          <Menu ref="stausMenuRef" :defaultValue="0" :menuList="menuStatusList" v-show="isShowFilterStatus"
                @select="handleSelectStatus"/>
        </div>
      </div>
    </div>
    <div class="dashboard-record-table">
      <div class="dashboard-record-table-header">
        <div class="dashboard-record-table-header-icon">
          <img :src="TableFilterIcon"/>
        </div>
        <div class="dashboard-record-table-header-list">
          <div class="dashboard-record-table-header-item">
            <div class="dashboard-record-table-header-item-label">{{ t('record.resumeFilter') }}</div>
            <div class="dashboard-record-table-header-item-num">
              <span>{{ checkedResumeNum }}</span>
              <img :src="TableStarIcon"/>
            </div>
          </div>
          <div class="dashboard-record-table-header-item">
            <div class="dashboard-record-table-header-item-label">{{ t('record.resumeReceive') }}</div>
            <div class="dashboard-record-table-header-item-num">
              <span>{{ receivedResumeNum }}</span>
              <img :src="TableStarIcon"/>
            </div>
          </div>
          <div class="dashboard-record-table-header-item">
            <div class="dashboard-record-table-header-item-label">{{ t('record.chatCandidate') }}</div>
            <div class="dashboard-record-table-header-item-num">
              <span>{{ contactedCandidateNum }}</span>
              <img :src="TableStarIcon"/>
            </div>
          </div>
        </div>
      </div>
      <Table :data="tableData" :loading="loading"/>
      <div class="dashboard-record-table-pagination">
        <el-pagination
            v-model:current-page="pageNo"
            v-model:page-size="pageSize"
            v-model:page-count="pages"
            layout="prev, pager, next, jumper"
            :total="total"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
        />
      </div>
    </div>
    <search-result 
      v-if="showSearchPage"
      :tabList="tabList" 
      :searchText="searchStr"
      :tabActiveIndex="tabActiveIndex"
      @closeSearchPage="showSearchPage = false">
    </search-result>
  </div>
</template>

<script>
import { 
  defineComponent,
  ref,
  watch,
  inject,
  computed,
  onMounted,
  onActivated,
  nextTick
} from 'vue';
import { ElTabs, ElTabPane, ElPagination, ElMessage, ElAutocomplete } from 'element-plus'
import Table from './table.vue'
import Menu from '~/components/menu/index.vue'
import SearchResult from './searchResult.vue'
import {createMessage, CreateMessageModel, useGlobalState} from '~/store/global'
import { taskApi } from '~/api/TaskApi'
import { API_ROUTE_RECORD } from '~/constants/apiRoutes'
import { post } from '~/api/axios'
import { recordApi } from '~/api/RecordApi.ts'
 
import TableFilterIcon from "~/assets/icons/table-filter.svg"
import TableStarIcon from "~/assets/icons/table-Star.svg"
import ClockIcon from "~/assets/icons/clock.svg"
import ExpandIcon from "~/assets/icons/expand.svg"
import SearchIcon from "~/assets/icons/search.svg"
import ExpandMoreIcon from "~/assets/icons/expand-more.svg"

import {onClickOutside} from '@vueuse/core'
import {Cmd, ResponseMessage} from '~/constants/MessageModel';
// import {csApiSender} from "~contents/utils/CsApiSender";
// import {ApiResult} from "~components/fetch";
import {ApiCodeEnum} from "~/constants/ApiCodeEnum";

import { useI18n } from 'vue-i18n'

export default defineComponent({
  components: {
    // ElTabs,
    // ElTabPane,
    Table,
    ElAutocomplete,
    // ElPagination,
    Menu,
    SearchResult
  },
  setup(props, {emit}) {
    const { t } = useI18n()

    const pageNo = ref(1)
    const pageSize = ref(10)
    const pages = ref(0);
    const tabActiveIndex = ref(0)
    const isShowFilterJob = ref(false)
    const isShowFilterClock = ref(false)
    const isShowFilterStatus = ref(false)
    const searchExpended = ref(false)
    const searchStr = ref('')
    const tableData = ref([])
    const loading = ref(false)
    const clockText = ref(t('record.filterDay', { day: 30}))
    const clockValue = ref('1m')
    const statusText = ref(t('record.filterStatus.all'))
    const statusValue = ref(-1)
    const total = ref(0)
    const showSearchPage = ref(false)

    const checkedResumeNum = ref(0) // 已筛选简历数目
    const receivedResumeNum = ref(0) // 已接收简历数目
    const contactedCandidateNum = ref(0) // 已沟通候选人数目

    const stausMenuRef = ref()
    const clockMenuRef = ref()
    const JobMenuRef = ref()

    const {setTotalResume, setIsLogined} = useGlobalState()

    onClickOutside(stausMenuRef, () => {
      isShowFilterStatus.value = false
    })
    onClickOutside(clockMenuRef, () => {
      isShowFilterClock.value = false
    })
    onClickOutside(JobMenuRef, () => {
      isShowFilterJob.value = false
    })

    const activeTab = ref('')
    const tabList = ref([]);
    const visibleTabList = ref([])
    const expandTabList = ref([]);

    const menuClockList = ref([
      {label: t('record.filterDay', { day: 1}), value: '1d'},
      {label: t('record.filterDay', { day: 3}), value: '3d'},
      {label: t('record.filterDay', { day: 7}), value: '7d'},
      {label: t('record.filterDay', { day: 30}), value: '1m'}
    ]);
    const menuStatusList = ref([
      {label: t('record.filterStatus.all'), value: -1},
      {label: t('record.filterStatus.pass'), value: 1},
      {label: t('record.filterStatus.nopass'), value: 2}
    ]);

    // ==================== computed ====================

    const getPostData = computed(() => {
      return {
        current: pageNo.value,
        taskId: tabList.value?.[tabActiveIndex.value]?.id,
        recordTimeRange: clockValue.value,
        resumeStatus: statusValue.value,
      }
    })

    // ==================== watch ====================

    const keyupEnter = (event) => {
      console.log('keyupEnter = ',event);
    }

    const queryTableList = async (data) => {
        return await post(API_ROUTE_RECORD, data);
    }
    const queryTable = async (data) => {
      loading.value = false;

      const _data = {
        ...getPostData.value,
        ...data
      }
      if (!_data?.taskId) {
        setTotalResume(0);
        return;
      }
      const apiResult = await queryTableList(_data);
      if (apiResult.code !== ApiCodeEnum.OK) {
        ElMessage.error(apiResult.msg);
        return;
      }
      const res = apiResult.data;
      console.log('apiResult.data = ', res);
      if (res) {
        checkedResumeNum.value = res.stats.checkedResumeNum;
        receivedResumeNum.value = res.stats.receivedResumeNum;
        contactedCandidateNum.value = res.stats.contactedCandidateNum;

        total.value = res?.resumes?.total;
        pages.value = res?.resumes?.pages;
        console.log('total.value = ', total.value);
        setTotalResume(res.stats.checkedResumeNum);

        tableData.value = res?.resumes?.records?.map?.(item => {
          item.phone = item?.contact?.value
          return item
        })
      } else {
        createMessage(new CreateMessageModel('warning', t('message.errorTip')));
      }
      loading.value = false
    }

    const selectSuggest = () => {
      showSearchPage.value = true
      searchExpended.value = false
    }


    watch(() => [tabActiveIndex.value, clockValue.value, statusValue.value], (newVal, oldVal) => {
      console.log('参数--watch', newVal, newVal[1] !== oldVal[1], oldVal, getPostData.value)
      if (newVal[1] !== oldVal[1] || newVal[2] !== oldVal[2]) {
        pageNo.value = 1
        queryTable({current: 1})
      } else {
        queryTable()
      }

    })
    const handleTabClick = (tab, event) => {
      console.log(tab, event)
    }
    const handleSizeChange = (...args) => {
      console.log('handleSizeChange', args)
    }
    const handleCurrentChange = () => {
      // console.log('handleCurrentChange', args)
      queryTable()
    }
    const handleSelectTab = (index) => {
      tabActiveIndex.value = index
    }
    const handleFilterClock = () => {
      isShowFilterClock.value = !isShowFilterClock.value
    }
    const handleFilterStatus = () => {
      isShowFilterStatus.value = !isShowFilterStatus.value
    }

    const queryJobLabels = async () => {
      const apiResult = await taskApi.queryJobLabels();

      if (apiResult.code !== ApiCodeEnum.OK) {
        ElMessage.error(apiResult.msg);
        setIsLogined(false);
        return;
      }
      if (apiResult.data) {
        tabList.value = apiResult.data.map(item => {
          item.label = item.jobTitle
          item.name = item.jobTitle
          return item
        })
        updateTabs()
        if (apiResult.data?.length > 6) {
          expandTabList.value = apiResult.data.slice(6)
        }
      }
    }

    const expendSearch = (value) => {
      searchExpended.value = value
      if(value == false){
        console.log(123);
        showSearchPage.value = true
      }
    }

    const searchSuggest = async (queryString, cb) => {
      // const results = queryString
      //   ? restaurants.value.filter(createFilter(queryString))
      //   : restaurants.value
      console.log('searchSuggest queryString = ',queryString)
      if(queryString == '') return
      const param = {
        taskId: tabList.value[tabActiveIndex.value].id,
        keyword: queryString
      }
      const res = await recordApi.searchSuggest(param)
      console.log('searchSuggest res = ',res);
      const result = []
      if(res.code == 0){
        for(let item of res.data){
          const suggestItem = {
            value: item,
            link: ''
          }
          result.push(suggestItem)
        }
        cb(result)
      }
      // call callback function to return suggestions
    }

    const updateTabs = () => {
      nextTick(() => {
        const container = document.querySelector('.dashboard-record-filter-tabs');
        const allTabElements = container.querySelectorAll('.dashboard-record-filter-tab');
        let totalWidth = 0;
        visibleTabList.value = [];
        expandTabList.value = [];

        tabList.value.forEach((tab, index) => {
          const tabWidth = allTabElements[index].offsetWidth+24;
          // console.log('tabWidth = ',tabWidth);
          totalWidth += tabWidth;
          // console.log('updateTabs totalWidth = ',totalWidth);
          // console.log('updateTabs container.offsetWidth = ',container.offsetWidth);
          if (totalWidth > container.offsetWidth) {
            expandTabList.value.push(tab);
          } else {
            visibleTabList.value.push(tab);
          }
        });
      });
    }

    const handleSelectClock = (menu) => {
      clockText.value = menu.label
      clockValue.value = menu.value
    }
    const handleSelectStatus = (menu) => {
      statusText.value = menu.label
      statusValue.value = menu.value
    }

    const handleSelectJob = (menu, index) => {
      tabActiveIndex.value = index + 6
      queryTable({
        current: 1,
        taskId: menu?.id,
      })
    }

    const handleExpandMoreJob = () => {
      isShowFilterJob.value = !isShowFilterJob.value
    }

    onActivated(async () => {
      await queryJobLabels()
      await queryTable()
    })

    return {
      handleTabClick,
      pageNo,
      pageSize,
      pages,
      handleSizeChange,
      handleCurrentChange,
      handleSelectTab,
      tabActiveIndex,
      menuClockList,
      menuStatusList,
      isShowFilterClock,
      isShowFilterStatus,
      handleFilterClock,
      handleFilterStatus,
      handleSelectClock,
      handleSelectStatus,
      handleExpandMoreJob,
      handleSelectJob,
      updateTabs,
      searchExpended,
      expendSearch,
      searchStr,
      showSearchPage,
      searchSuggest,
      selectSuggest,

      clockText,
      statusText,
      tableData,
      total,
      loading,
      checkedResumeNum,
      receivedResumeNum,
      contactedCandidateNum,
      isShowFilterJob,

      stausMenuRef,
      clockMenuRef,
      JobMenuRef,

      t,

      activeTab,
      tabList,
      visibleTabList,
      expandTabList,
      TableFilterIcon,
      TableStarIcon,
      ClockIcon,
      ExpandIcon,
      ExpandMoreIcon,
      SearchIcon
    }
  }
})
</script>
<style scoped>
.search-box{
}
.search-box:deep(.el-input__wrapper){
  background: rgba(255, 255, 255, 0.1);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: none;
}
.search-icon{
  width: 32px;
  height: 28px;
  border-radius: 8px;
  border: 0.5px;
  background: rgba(255, 255, 255, 0.1);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.search-input{
  width: 280px;
  height: 32px;
  background: rgba(255, 255, 255, 0.1);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  transition: width 0.3s;
}
.search-input:deep(.el-input__wrapper){
  background: rgba(255, 255, 255, 0.1);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: none;
}
.input-search-icon{
  cursor: pointer;
}
</style>