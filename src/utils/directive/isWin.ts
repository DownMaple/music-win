import {useWinStore} from "@/store/modules/system.ts";

export default {
	mounted(el: HTMLElement) {
		if (!useWinStore().isWin) {
			el.style.display = "none"
		}
	}
}