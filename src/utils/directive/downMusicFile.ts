import {useWinStore} from "@/store/modules/system.ts";

export default  {
	mounted( _:HTMLElement , bindings: Object) {
		if (useWinStore().isWin) {
		
		} else {
			console.log(bindings)
		}
	}
}