import {defineStore} from "pinia";

export const musicStore = defineStore('music', {
	state: (): {
		musicId: number,
		musicList: object[],
		musicLink: string,
		musicPlay: boolean,
		musicPlayModel: string,
		musicPlayTime: string,
		musicAllTime: string,
		musicTitle: string,
		musicAuthor: string,
		musicIndex: number,
		musicVolume: number,
		musicMuted: boolean,
		musicPlayTimeNum: number,
		musicStep: number,
		musicIsCache: boolean,
		musicAllTimeNum: number,
	} => {
		return {
			musicId: 0,
			musicList: [],
			musicLink: '',
			musicPlay: false,
			musicPlayModel: 'SINGLE_LOOP',
			musicPlayTime: '00:00',
			musicPlayTimeNum: 0,
			musicAllTimeNum: 0,
			musicAllTime: '00:00',
			musicTitle: '',
			musicAuthor: '',
			musicIndex: 0,
			musicVolume: 100,
			musicMuted: false,
			musicStep:0,
			musicIsCache:false,
		}
	},
	actions: {
		setMusicList(list: object[]) {
			this.musicList = list
		},
		setMusicLink(link: string) {
			this.musicLink = link
		},
		setMusicPlayModel(model: string) {
			this.musicPlayModel = model
		},
		setMusicPlayTime(time: string) {
			this.musicPlayTime = time
		},
		setMusicAllTime(time: string) {
			this.musicAllTime = time
		},
		setMusicTitle(title: string) {
			this.musicTitle = title
		},
		setMusicAuthor(author: string) {
			this.musicAuthor = author
		},
		setMusicIndex(index: number) {
			this.musicIndex = index
		},
		setMusicVolume(volume: number) {
			this.musicVolume = volume
		},
		setMusicMuted(muted: boolean) {
			this.musicMuted = muted
		},
		setMusicPlayTimeNum(time: number) {
			this.musicPlayTimeNum = time
		},
		setMusicAllTimeNum(time: number) {
			this.musicAllTimeNum = time
		},
		setMusicPlay(play: boolean) {
			this.musicPlay = play
		},
		setMusicStep(step: number) {
			this.musicStep = step
		},
		setMusicIsCache(isCache: boolean) {
			this.musicIsCache = isCache
		},
		setMusicId(id: number) {
			this.musicId = id
		},
	},
	persist:true
})