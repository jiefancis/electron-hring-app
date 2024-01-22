import {post} from "./axios";

class RecordApi {
    public searchResume = async (param) => {
        return await post('/resume/search',param)
    }
    public searchSuggest = async (param) => {
        return await post('/resume/autocomplete',param)
    }
}

export const recordApi = new RecordApi()