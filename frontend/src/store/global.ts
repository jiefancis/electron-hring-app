import {createApp, ref} from 'vue'
import {createGlobalState} from '@vueuse/core'
import {STORE_IS_LOGIN_KEY} from '~/constants'
import {storageGet} from "~/utils";
import TsMessage from '~/components/message/index.vue';
export const useState = (value) => {
    let state = ref(value)
    const setState = (val) => {
        state.value = val
    }
    return [state, setState];
};

export const useGlobalState = createGlobalState(
    () => {

        const [currentTaskId, setCurrentTaskId] = useState(-1)

        const [taskInfo,setTaskInfo] = useState(null)

        const [isTaskRunning, setIsTaskRunning] = useState(false)

        const [totalResume, setTotalResume] = useState(0)

        const [isLogined, setIsLogined] = useState(storageGet(STORE_IS_LOGIN_KEY));

        const [showWindow, setShowWindow] = useState(false)

        const [isEngineStart, setIsEngineStart] = useState(false)

        const [navActiveIndex, setNavActiveIndex] = useState(0)

        const [showMemberModal, setShowMemberModal] = useState(false)

        
        const [isMember, setIsMember] = useState(false)
        const [isOutMember, setIsOutMember] = useState(false)
        const [goodsList, setGoodsList] = useState([])
        const [subscribeStatus, setSubscribeStatus] = useState(-1)
        const [freeTrialTimes, setFreeTrialTimes] = useState(0)
        const [subscribeRemainTime, setSubscribeRemainTime] = useState('')

        return {
            currentTaskId,
            setCurrentTaskId,
            taskInfo,
            setTaskInfo,
            isTaskRunning,
            setIsTaskRunning,
            totalResume,
            setTotalResume,
            isLogined,
            setIsLogined,
            showWindow,
            setShowWindow,
            isEngineStart,
            setIsEngineStart,
            navActiveIndex,
            setNavActiveIndex,
            showMemberModal, setShowMemberModal,
            isMember, setIsMember,
            isOutMember, setIsOutMember,
            goodsList, setGoodsList,
            subscribeStatus, setSubscribeStatus,
            freeTrialTimes, setFreeTrialTimes,
            subscribeRemainTime, setSubscribeRemainTime
        }
    }
)

export class CreateMessageModel {
    type: string;
    message: string;
    duration: number;
    jumpUrl: string;

    constructor(type: string, message: string, duration: number = 3000, jumpUrl: string = '') {
        this.type = type;
        this.message = message;
        this.duration = duration;
        this.jumpUrl = jumpUrl;
    }
}

export const createMessage = (model: CreateMessageModel) => {
    const messageInstance = createApp(TsMessage, {
        type: model.type,
        message: model.message,
        duration: model.duration,
        jumpUrl: model.jumpUrl
    });
    const mountNode = document.createElement('div');
    document.body.appendChild(mountNode);

    messageInstance.mount(mountNode);

    setTimeout(() => {
        messageInstance.unmount();
        document.body.removeChild(mountNode);
    }, model.duration + 2000);
};
