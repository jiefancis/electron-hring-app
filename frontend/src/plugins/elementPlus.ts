import {
    ElTabs,
    ElTabPane,
    ElPagination,
    ElMessage,
    ElTable,
    ElTableColumn,
    ElTooltip,
    ElInput,
    ElProgress
} from 'element-plus'

const elements = [
    ElTabs, ElTabPane, ElPagination, ElMessage,
    ElTable, ElTableColumn, ElTooltip, ElInput,
    ElProgress,
]
const install = (app) => {
    elements.forEach(comp => app.component(comp.name, comp))
}

export default install;