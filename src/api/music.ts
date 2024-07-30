import {getJson} from "@/utils/request.ts";

/**
 * 获取歌词
 * @param id
 */
export const getMusicLyricsAPI = (id: MusicType['id']) => {
	return getJson('/music/lyrics', {id})
}