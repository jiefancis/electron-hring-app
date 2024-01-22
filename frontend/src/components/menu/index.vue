<template>
    <div class="dashboard-filter-menu">
        <div :class="[
                'dashboard-filter-menu-item',
                'ellipsis-line',
                activeIndex === index ? 'dashboard-filter-menu-item-active' : ''
            ]"
            v-for="(menu, index) in menuList" :key="index"
            @click="() => handleSelect(menu, index)"
        >
            <div>{{  menu.label }}</div>
            <img :src="MenuSelectedIcon" v-show="activeIndex === index"/>
        </div>
    </div>
</template>

<script>
import {defineComponent, ref} from 'vue';
import MenuSelectedIcon from "~/assets/icons/menu-selected.svg"

export default defineComponent({
    name: 'menu',
    props: {
        menuList: {
            type: Array,
            default: () => ([])
        },
        defaultValue: {
            type: Number,
            default: () => -1
        }
    },
    setup(props, { emit }) {
        console.log('props.menuList', props, props.menuList)
        const activeIndex = ref(props.defaultValue)

        const handleSelect = (menu, index) => {
            activeIndex.value = index
            emit('select', menu, index)
        }


        return {
            activeIndex,
            handleSelect,
            menuList: props.menuList,
            MenuSelectedIcon
        }
    }
})




</script>
