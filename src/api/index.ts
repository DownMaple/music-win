import {getJson} from "@/utils/request.ts";

/**
 * 获取首页推荐
 */
export const getHomeRecommendation = () =>  {
	return getJson('/music/getOne', {id: 1})
}