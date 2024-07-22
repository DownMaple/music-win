import {openDB} from "idb";

const dbPromise = openDB('music-db', 1, {
	upgrade(db) {
		if (!db.objectStoreNames.contains('musicFiles')) {
			db.createObjectStore('musicFiles', {keyPath: 'key'});
		}
	}
})

/**
 * 缓存文件
 * @param key
 * @param file
 */
export async function saveMusicFile(key: string, file: ArrayBuffer) {
	const db = await dbPromise
	const tx = db.transaction('musicFiles', 'readwrite');
	const store = tx.objectStore('musicFiles');
	await store.put({key, file})
	await tx.done;
}

/**
 * 获取缓存文件
 * @param key
 */
export async function getMusicFile(key: string) {
	const db = await dbPromise
	const data = await db.get('musicFiles', key)
	return data ? data.file : null
}

/**
 * 清空缓存文件
 */
export async function clearMusicFile() {
	const db = await dbPromise
	await db.clear('musicFiles')
}

/**
 * 是否有缓存文件
 * @param url
 */
export async function isHaveMusicFile(url: string) {
	const db = await dbPromise
	const data = await db.get('musicFiles', url)
	return !!data
}

/**
 * 将 Blob 转换为 ArrayBuffer
 * @param {Blob} blob
 * @returns {Promise<ArrayBuffer>}
 */
export function blobToArrayBuffer(blob: Blob): Promise<ArrayBuffer> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onerror = reject;
		reader.readAsArrayBuffer(blob);
		reader.onloadend = () => {
			resolve(reader.result as ArrayBuffer);
		};
	});
}
