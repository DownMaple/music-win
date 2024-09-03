use tauri::{command, Window};

#[command]
pub fn is_window_maximized(window: Window) -> bool {
    window.is_maximized().unwrap()
}

// 监听窗口状态变化
pub fn win_state_change(window: Window, is_maximized: bool) {
    window.emit("windowStateChanged", is_maximized).unwrap();
}