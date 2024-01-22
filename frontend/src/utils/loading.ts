import {ElLoading} from 'element-plus';


function createLoading(text = 'Loading') {
    const loadingService = ElLoading.service({
        target: document.body,
        lock: true,
        text,
        background: 'rgba(0, 0, 0, 0.8)',
    })
    return () => {
        loadingService.close()
    }
}

export default createLoading;
