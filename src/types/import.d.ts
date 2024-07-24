interface ImportMetaEnv {
	readonly VITE_APP_URL: string
	readonly VITE_APP_UPLOAD: string
	readonly VITE_APP_UPLOADFILE: string
	readonly VITE_APP_RICH: string
	readonly VITE_APP_RICH_VIDEO: string
}

interface ImportMeta {
	readonly env: ImportMetaEnv
}

