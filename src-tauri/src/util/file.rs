use std::{fs, io};
use std::fs::OpenOptions;
use std::io::Write;
use futures::StreamExt;
use reqwest::Client;
use tauri::{command};
use log::log;
use crate::db::connection::{get_download_history, insert_download_history, update_download_history, DownloadHistory};
use crate::util::config::{get_config_key, update_config_key};
use crate::util::path::resolve_path;
use crate::util::res::{res_data, res_error, res_message, Res};

#[command]
pub async fn download_file(name:String, url: String) -> Res<String> {
    let client = Client::new();

    let response = client.get(&url).send().await.expect("请求失败");
    if !response.status().is_success() {
        return res_error("下载失败")
    }


    let total_size = response.content_length().expect("文件大小获取失败");
    let download_directory = match get_config_key("download_directory") {
        Ok(Some(dir)) => dir,
        Ok(None) => {
            // 如果没有找到配置项，设置默认路径
            let default_dir = "download";
            if let Err(e) = update_config_key("download_directory", default_dir) {
                return res_error(format!("保存默认配置失败: {}", e));
            }
            default_dir.to_string()
        }
        Err(e) => return res_error(format!("读取配置文件失败: {}", e)),
    };

    let download_path = match resolve_path(&download_directory) {
        Ok(path) => path,
        Err(e) => return res_error(format!("解析路径失败: {}", e)),
    };

    // 确保下载目录存在
    if let Err(e) = fs::create_dir_all(&download_path) {
        return res_error(format!("创建下载目录失败: {}", e));
    }

    // 拼接文件夹路径和文件名，形成完整的文件路径
    let file_path = download_path.join(&name);

    let mut file = OpenOptions::new().create(true).write(true).open(file_path).expect("创建文件失败");

    let mut downloaded:u64 = 0;
    let mut stream = response.bytes_stream();

    let download_history_data: DownloadHistory = insert_download_history(name, url, download_path.to_string_lossy().to_string() , 0).await.expect("记录下载数据失败");

    while let Some(chunk) = stream.next().await {
        let chunk = chunk;

        match chunk {
            Ok(chunk) => {
                file.write_all(&chunk).expect("写入文件失败");

                // 更新已下载数据量
                downloaded += chunk.len() as u64;

                // 计算并显示下载进度
                let progress = (downloaded as f64 / total_size as f64) * 100.0;
                print!("\rDownloading: {:.1}%", progress);
                io::stdout().flush().expect("刷新标准输出失败");
            }
            Err(_) => {
                update_download_history(download_history_data.id, ((downloaded as f64 / total_size as f64) * 100.0) as i32, downloaded, 3).expect("修改下载状态失败");
                return res_error("下载失败");
            }
        }
    }
    // println!("下载完成：{}", downloaded);
    update_download_history(download_history_data.id, 100, downloaded, 0).expect("修改下载状态失败");
    res_message("文件下载完成")
}

#[command]
pub async fn download_history_list() -> Res<Vec<DownloadHistory>> {
    let list = get_download_history().expect("获取下载记录失败");
    res_data(list)
}