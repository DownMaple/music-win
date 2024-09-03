use std::fs;
use std::path::Path;
use serde::{Deserialize, Serialize};
use serde_json;
use serde_json::Value;

#[derive(Serialize, Deserialize)]
pub struct Config {
    pub download_directory: String,
}

pub fn read_config() -> Config {
    let config_path = "config.json";
    if Path::new(config_path).exists() {
        let config_data = fs::read_to_string(config_path).expect("Unable to read config file");
        serde_json::from_str(&config_data).expect("Unable to parse config file")
    } else {
        // 默认配置
        Config {
            download_directory: "download".to_string(),
        }
    }
}

pub fn update_config_key(key: &str , value: &str) {
    let config_path = "config.json";
    let config_data = fs::read_to_string(config_path).expect("无法读取配置文件");
    // 解析为 serde_json::Value 类型，方便操作其中的字段
    let mut config_json:Value = serde_json::from_str(&config_data).expect("无法解析配置文件");
    // 更新指定字段的值
    if let Some(field) = config_json.get_mut(key) {
        *field = Value::String(value.to_string());
    } else {
        println!("字段 '{}' 不存在于配置文件中", key);
    }
    fs::write(config_path, config_json.to_string()).expect("无法写入配置文件");
}