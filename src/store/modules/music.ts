import {defineStore} from "pinia";

export const musicStore = defineStore('music', {
	state: (): {
		musicId: number,
		musicList: MusicType[],
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
		musicCollection: boolean,
		musicImg: string,
		musicAllTimeNum: number,
	} => {
		return {
			musicId: 0,  //   音乐id
			musicImg: '',   //   音乐图片
			musicList: [],  //  音乐队列
			musicLink: '',  //    当前音乐链接
			musicPlay: false,  //  播放器状态
			musicPlayModel: 'SINGLE_LOOP',  //  播放模式
			musicPlayTime: '00:00',  //    当前播放进度
			musicPlayTimeNum: 0,  //   当前播放进度秒数
			musicAllTimeNum: 0,  //   当前音乐总秒数
			musicAllTime: '00:00',  //   当前音乐总时长
			musicTitle: '',  //  音乐名称
			musicAuthor: '',  //  音乐作者
			musicIndex: 0,  //   当前音乐索引
			musicVolume: 100,  //  当前音乐音量
			musicMuted: false,  //  当前音乐是否静音
			musicStep: 0,  //    音乐步进值
			musicCollection: false,   //  是否收藏音乐
			musicIsCache: false,  //    是否缓存音乐
		}
	},
	actions: {
		setMusicList(list: MusicType[]) {
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
		setMusicCollection(collection: boolean) {
			this.musicCollection = collection
		},
		setMusicImg(img: string) {
			this.musicImg = img
		},
	},
	persist: true
})