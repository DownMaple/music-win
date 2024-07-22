
// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
use tauri::{Manager, Window, WindowEvent};

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
        .invoke_handler(tauri::generate_handler![is_window_maximized])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


#[tauri::command]
fn is_window_maximized(window: Window) -> bool {
    window.is_maximized().unwrap()
}

// 监听窗口状态变化
fn win_state_change(window: Window, is_maximized: bool) {
    window.emit("windowStateChanged", is_maximized).unwrap();
}