export const config = {
  loadingTime: 500, //loading 图标延迟关闭时间
  url: import.meta.env.VITE_APP_URL,
  baseURL: import.meta.env.VITE_APP_URL,
  uploadUrl: import.meta.env.VITE_APP_UPLOAD,
  uploadFile: import.meta.env.VITE_APP_UPLOADFILE,
  editorUpload: import.meta.env.VITE_APP_RICH ,// 富文本文件上传
  editorUploadVideo: import.meta.env.VITE_APP_RICH_VIDEO // 富文本视频上传
}
