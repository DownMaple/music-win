import { listen } from '@tauri-apps/api/event'
import {useWinStore} from "@/store/modules/system.ts";

listen('windowStateChanged', (event) => {
	useWinStore().setIsMaxWin(event.payload as boolean)
})