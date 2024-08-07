import userLogin from "@/utils/directive/userLogin.ts";
import {App, Directive} from "vue";
import isWin from "@/utils/directive/isWin.ts";
import downMusicFile from "@/utils/directive/downMusicFile.ts";

type DirectiveMap = {
	[key: string]: Directive;
};

const directive : DirectiveMap = {
	userLogin,
	isWin,
	downMusicFile
}

export default {
	install(app : App) {
		Object.keys(directive).forEach(key => {
			app.directive(key, directive[key])
		})
	}
}