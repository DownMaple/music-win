import {useWinStore} from "@/store/modules/system.ts";
import {urlDownFile} from "@/utils/index.ts";
import {invoke} from "@tauri-apps/api";
import {config} from "@/utils/config.ts";
import {message} from "ant-design-vue";


/**
 * tauri 下载文件
 * @param name
 * @param url
 * @param data
 */
export const tauriDownFile = async (name: string, url: string, data: object = {}) => {
	// 首先判断当前环境是否为桌面端
	if (useWinStore().isWin) {
		let fileName = name + '.'
		let urlArray = url.split('.')
		if (urlArray.length > 1) {
			fileName += urlArray[urlArray.length - 1]
		}
		const res = await invoke('download_file', {name: fileName, url: config.tauriDownFile + url})
		if (res.code === 200) {
			console.log(res)
		} else {
			message.error(res.message);
		}
	} else {
		await urlDownFile(name, url, data)
	}
}

export const getDownloadHistory = async () => {
	const res = await invoke('download_history_list')
	console.log(res)
	if (res.code === 200) {
		return res.data
	} else {
		message.error(res.message);
		return []
	}
}