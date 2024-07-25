import {getJson} from "@/utils/request.ts";

export const getSongListOne = (id: SongListType['id']) => {
	return getJson('/song_list/getOne', {id})
}