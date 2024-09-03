#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod util;
use tauri::{Manager, WindowEvent};
use crate::util::path::{get_install_path, select_file_path};
use crate::util::windows::{is_window_maximized, win_state_change};

fn main() {
    tauri::Builder::default()
        .setup(|app| {
            // 获取主窗口句柄
            let main_window = app.get_window("main").unwrap();
            main_window.clone().on_window_event(move |event| {
                match event {
                    WindowEvent::Resized(_) => {
                        // 窗口大小改变事件
                        if main_window.is_maximized().unwrap() {
                            // 调用命令通知前端窗口状态变化
                            win_state_change(main_window.clone(), true);
                        } else {
                            // 调用命令通知前端窗口状态变化
                            win_state_change(main_window.clone(), false);
                        }
                    }
                    _ => {}
                }
            });
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![is_window_maximized, get_install_path, select_file_path])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

