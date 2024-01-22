<template>
    <div class="dashboard-job-setting">
        <div class="dashboard-job-setting-item" v-for="(setting, index) in settingList" @click="handleSettingAction(setting)">
            <img class="dashboard-job-setting-item-icon" :src="setting.icon" />
            <div class="dashboard-job-setting-item-text">{{ setting.text }}</div>
        </div>
    </div>
</template>
<script>
import {defineComponent, ref} from 'vue';
import EditIcon from '~/assets/icons/edit.svg'
import DeleteIcon from "~/assets/icons/delete.svg"
import { useI18n } from 'vue-i18n'

export default defineComponent({
    setup(props, { emit }) {
        const { t } = useI18n()

        const settingList = ref([
            {
                text: t('button.edit'),
                icon: EditIcon,
                operate: 1,
            },
            {
                text: t('button.delete'),
                icon: DeleteIcon,
                operate: 2,
            },
        ])

        const handleSettingAction = (setting) => {
            if(setting?.operate === 1) {
                emit('changeWindowShow', true)
            } else {
                emit('handleDeleteJob')
            }
        }
        return {
            settingList,
            handleSettingAction,
        }
    }
})
</script>
