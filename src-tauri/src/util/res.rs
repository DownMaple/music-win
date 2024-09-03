use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize)]
pub struct Res<T> {
    code: u16,
    message: String,
    data: Option<T>,
}

impl<T> Res<T> {
    /// 构造一个带有消息的成功响应
    fn message(message: impl Into<String>) -> Self {
        Res {
            code: 200,
            message: message.into(),
            data: None,
        }
    }

    /// 构造一个带有数据的成功响应
    fn data(data: T) -> Self {
        Res {
            code: 200,
            message: "success".to_string(),
            data: Some(data),
        }
    }
    /// 构造一个带有错误消息的错误响应
    fn error(message: impl Into<String>) -> Self {
        Res {
            code: 500,
            message: message.into(),
            data: None,
        }
    }
}

pub fn res_message(message: impl Into<String>) -> Res<String> {
    Res::message(message)
}
pub fn res_data<T>(data: T) -> Res<T> {
    Res::data(data)
}
pub fn res_error(message: impl Into<String>) -> Res<String> {
    Res::error(message)
}