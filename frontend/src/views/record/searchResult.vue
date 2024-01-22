<template>
    <div class="search-result-bg">
        <div class="search-result-box">
            <div class="header-box">
                <el-input v-model="searchStr" placeholder="搜索" class="search-input" @keyup.enter="queryTable">
                    <template #prefix>
                        <img :src="SearchIcon" class="input-search-icon" @click="queryTable()"/>
                    </template>
                </el-input>
            </div>
            <img class="close-icon" :src="CloseIcon" @click="closeSearchPage"/>
            <el-tabs class="tab-box" @tab-click="handleSelectTab" v-model="activeTab">
                <el-tab-pane
                    class="tab-pane"
                    v-for="(tab, index) in props.tabList"
                    :key="index"
                    :label="tab.name"
                    :name="tab.name">
                </el-tab-pane>
            </el-tabs>
            <Table :data="tableData" :loading="loading"></Table>
            <div class="dashboard-record-table-pagination">
                <el-pagination
                    v-model:current-page="pageNo"
                    v-model:page-size="pageSize"
                    v-model:page-count="pages"
                    layout="prev, pager, next, jumper"
                    :total="total"
                />
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
import { defineEmits,defineProps,onBeforeMount } from 'vue'
import { ElInput,ElTabs,ElTabPane } from 'element-plus'
import SearchIcon from "~/assets/icons/search.svg"
import CloseIcon from "~/assets/icons/close-icon.svg"
import Table from './table.vue'
import { recordApi } from '~/api/RecordApi.ts'

const searchStr = ref('')
const activeTab = ref('')
const loading = ref(false)
const tableData = reactive([])
const pageNo = ref(1)
const pageSize = ref(10)
const pages = ref(0)
const total = ref(0)

let taskId = ''

const emit = defineEmits()
const props = defineProps({
    tabList: {
        type: Array,
        default: []
    },
    tabActiveIndex: {
        type: Number,
        default: 0
    },
    searchText: {
        type: String,
        default: ''
    }
})

const closeSearchPage = () => {
    emit('closeSearchPage')
}

const handleSelectTab = (item) => {
    console.log('handleSelectTab item.index = ',item.index);
    taskId = props.tabList[item.index].id
    console.log('handleSelectTab props.tabList[item.index] = ',props.tabList[item.index]);
    queryTable()
}

const queryTable = async () => {
    const param = {
        taskId: taskId,
        resumeStatus: -1,
        highlightColor: "#81FF00",
        current: pageNo.value,
        pageSize: pageSize.value,
        keyword: searchStr.value
    }
    const res = await recordApi.searchResume(param)
    console.log('queryTable res = ',res);
    if(res.code == 0 && res.data.total>0){
        tableData.splice(0, tableData.length);
        tableData.push(...res.data?.records)
        total.value = res.data.total
        pageSize.value = res.data.size
    }
}

onBeforeMount(async ()=>{
    searchStr.value = props.searchText
    taskId = props.tabList[0].id
    activeTab.value = props.tabList[props.tabActiveIndex].name
    taskId = props.tabList[props.tabActiveIndex].id
    await queryTable()
})

</script>
<style scoped>
.search-result-bg{
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(0, 0, 0, 0.6);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
}
.search-result-box{
    width: 740px;
    height: 481px;
    border-radius: 16px;
    background: #2C2C2E;
    position: relative;
    display: flex;
    flex-direction: column;
}
.header-box{
    display: flex;
}
.search-input{
  width: 240px;
  height: 28px;
  background: rgba(255, 255, 255, 0.1);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  margin-top: 20px;
  margin-left: 24px;
}
.search-input:deep(.el-input__wrapper){
  background: rgba(255, 255, 255, 0.1);
  border: 0.5px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  box-shadow: none;
}
.close-icon{
    position: absolute;
    top: 8px;
    right: 8px;
    cursor: pointer;
}
.tab-box{
    display: flex;
    align-items: center;
    overflow: hidden;
    padding: 0 28px;
    box-sizing: border-box;
}
.tab-box:deep(.el-tabs__nav-wrap::after){
    height: 0px;
}
.tab-box:deep(.el-tabs__item){
    color: #EBEBF599;
}
.tab-box:deep(.el-tabs__active-bar){
    background: #81FF00;
}
.tab-pane{
}
.tab-pane:deep(.el-tabs__item.is-active){
    color: white!important;
}
</style>