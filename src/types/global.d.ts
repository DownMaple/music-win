interface GlobalData {
	id: number,
	status: number,
	create_id?: number,
	create_time?: string,
	update_id?: number,
	update_time?: string,
}

interface MusicType extends GlobalData {
	 img: string,
	 title: string,
	 author_id: number,
	 author_name?: string,
	 album_id: number,
	 album_title?: string,
	 issued_time: string,
	 duration?: string,
	 link: string,
	 classify_id?: string,
	 classify_title?: string,
	 views: number,
}


type ResType = {
	code:number,
	data: any,
	msg: string
}