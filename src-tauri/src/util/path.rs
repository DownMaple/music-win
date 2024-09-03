use std::{env, fs};
use std::path::{Path, PathBuf};
use tauri::command;
use crate::util::config::{read_config, update_config_key};
use crate::util::config::Config;
use rfd::{FileDialog};
use crate::util::res::{res_error, res_message, Res};

#[command]
pub fn get_install_path() -> String {
    // 获取当前可执行文件的目录
    let now_dir = env::current_exe().expect("无法获取当前可执行文件的目录");
    let current_dir = now_dir.parent().expect("无法获取当前可执行文件的父目录");

    // 读取配置文件
    let config: Config = read_config();
    let folder_to_check = &config.download_directory;
    // 生成完整的路径
    let folder_path: PathBuf = if Path::new(folder_to_check).is_absolute() {
        PathBuf::from(folder_to_check)
    } else {
        current_dir.join(folder_to_check)
    };
    // 检查并创建目录（如果不存在的话）
    if !folder_path.exists() {
        fs::create_dir_all(&folder_path).expect("创建文件夹失败");
    }
    folder_path.to_str().unwrap().to_string()
}


fn is_absolute_path(path: &str) -> bool {
    let path = Path::new(path);
    path.is_absolute()
}

#[command]
pub async fn select_file_path() -> Res<String> {
    // 打开文件夹选择对话框
    if let Some(folder_path) = FileDialog::new()
        .set_directory("/")
        .pick_folder()
    {
        // 将用户设置的路径保存到配置文件中
        update_config_key("download_directory", folder_path.to_str().unwrap());
        // 将路径转换为字符串并返回
        match folder_path.to_str() {
            Some(folder_path_str) => res_message(folder_path_str.to_string()),
            None => res_error("无法将路径转换为字符串".to_string()),
        }
    } else {
        res_error("用户未选择文件夹".to_string())
    }
}