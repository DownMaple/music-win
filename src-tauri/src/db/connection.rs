use rusqlite::{params, Connection, Result};
use serde::Serialize;

#[derive(Debug, Serialize)]
pub struct DownloadHistory {
    pub id: i32,
    pub file_name: String,
    pub url: String,
    pub download_path: String,
    pub progress: i32,
    pub state: i32,
}

pub fn init_db() -> Result<Connection> {
    let conn = Connection::open("app_data.db")?;
    create_table(&conn)?;
    Ok(conn)
}

fn create_table(conn: &Connection) -> Result<()> {
    // 创建表
    // id
    // file_name 下载文件的名称
    // url 下载文件的url
    // download_path 下载文件的路径
    // progress 下载进度
    // state 下载状态   0 表示暂停下载，1 表示正在下载，2 表示下载完成，3 表示下载失败
    conn.execute(
        "CREATE TABLE IF NOT EXISTS download_history (
             id INTEGER PRIMARY KEY AUTOINCREMENT,
             file_name varchar(255) NOT NULL,
             url varchar(255) NOT NULL,
             download_path varchar(255) NOT NULL,
             progress INTEGER NOT NULL,
             state INTEGER NOT NULL
         )",
        [],
    )?;
    Ok(())
}

// 增加下载记录
pub async  fn insert_download_history(file_name: String, url: String, download_path: String, progress: i32) -> Result<DownloadHistory, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    conn.execute("INSERT INTO download_history (file_name, url, download_path, progress, state) VALUES (?1, ?2, ?3, ?4, ?5)",
                 params![file_name, url, download_path, progress, 1]).map_err(|e| e.to_string())?;
    let id = conn.last_insert_rowid() as i32;
    Ok(DownloadHistory { id, file_name, url, download_path, progress, state: 1 })
}

// 修改下载记录
pub fn update_download_history(id: i32, progress: i32, state: i32) -> Result<(), String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    conn.execute("UPDATE download_history SET progress = ?1, state = ?2 WHERE id = ?3",
                 params![progress, state, id]).map_err(|e| e.to_string())?;
    Ok(())
}

// 查询下载记录
pub fn get_download_history() -> Result<Vec<DownloadHistory>, String> {
    let conn = init_db().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare("SELECT id, file_name, url, download_path, progress, state FROM download_history").map_err(|e| e.to_string())?;
    let download_history_iter = stmt.query_map([], |row| {
        Ok(DownloadHistory {
            id: row.get(0)?,
            file_name: row.get(1)?,
            url: row.get(2)?,
            download_path: row.get(3)?,
            progress: row.get(4)?,
            state: row.get(5)?,
        })
    }).map_err(|e| e.to_string())?;
    let mut download_history_list = Vec::new();
    for download_history in download_history_iter {
        download_history_list.push(download_history.map_err(|e| e.to_string())?);
    }
    Ok(download_history_list)
}

// 通过sql查询数据
pub fn conn_sql_select(sql:String) -> Result<Vec<DownloadHistory>, String>{
    let conn = init_db().map_err(|e| e.to_string())?;
    let mut stmt = conn.prepare(&sql).map_err(|e| e.to_string())?;
    let download_history_iter = stmt.query_map([], |row| {
        Ok(DownloadHistory {
            id: row.get(0)?,
            file_name: row.get(1)?,
            url: row.get(2)?,
            download_path: row.get(3)?,
            progress: row.get(4)?,
            state: row.get(5)?,
        })
    }).map_err(|e| e.to_string())?;
    let mut download_history_list = Vec::new();
    for download_history in download_history_iter {
        download_history_list.push(download_history.map_err(|e| e.to_string())?);
    }
    Ok(download_history_list)
}