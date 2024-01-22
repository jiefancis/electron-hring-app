import {sleep} from "~components/flowable/DomUtil";

export const isLiepinSite = () => location.href.includes('https://lpt.liepin.com/');

export const isLiepinResumePage = () => location.href.includes('https://lpt.liepin.com/cvview/showresumedetail');

export const isLiepinChatPage = () => location.href.includes('https://lpt.liepin.com/im/imresourceload');

export const isBossSite = () => location.href.includes('https://www.zhipin.com/web/chat');

export const isLiepinRecommendsPage = async () => {
    await sleep(1000);
    const recommendMenuElement = document.querySelector('[data-selector="home"] a') as HTMLElement;
    return location.href.includes('https://lpt.liepin.com/')
        && recommendMenuElement?.className?.includes('active')
        && recommendMenuElement?.innerText === '推荐';
}
