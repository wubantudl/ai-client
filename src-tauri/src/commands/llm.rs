use crate::llm::{self, ChatMessage, ModelConfig};
use serde::{Deserialize, Serialize};
use tauri::Emitter;
use tracing::info;

#[derive(Debug, Serialize, Deserialize)]
pub struct ChatResponsePayload {
    pub content: String,
}

#[tauri::command]
pub async fn chat(model_id: String, messages: Vec<ChatMessage>) -> Result<ChatResponsePayload, String> {
    info!("Chat command called with model: {}", model_id);
    
    let config = llm::load_config().map_err(|e| e.to_string())?;
    
    let model_config = config.models.iter()
        .find(|m| m.id == model_id)
        .ok_or_else(|| format!("Model not found: {}", model_id))?;

    match llm::chat(model_config, messages).await {
        Ok(response) => {
            let content = response.choices[0].message.content.clone();
            Ok(ChatResponsePayload { content })
        }
        Err(e) => Err(e.to_string())
    }
}

#[tauri::command]
pub async fn chat_stream(
    window: tauri::Window,
    model_id: String, 
    messages: Vec<ChatMessage>
) -> Result<(), String> {
    info!("Chat stream command called with model: {}", model_id);
    
    let config = llm::load_config().map_err(|e| e.to_string())?;
    
    let model_config = config.models.iter()
        .find(|m| m.id == model_id)
        .ok_or_else(|| format!("Model not found: {}", model_id))?;

    let window_clone = window.clone();
    
    match llm::chat_stream(model_config, messages, move |chunk| {
        let _ = window_clone.emit("stream-chunk", serde_json::json!({ "content": chunk }));
    }).await {
        Ok(_) => {
            let _ = window.emit("stream-done", ());
            Ok(())
        }
        Err(e) => Err(e.to_string())
    }
}

#[tauri::command]
pub fn get_models() -> Result<Vec<ModelConfig>, String> {
    info!("Get models command called");
    let config = llm::load_config().map_err(|e| e.to_string())?;
    Ok(config.models)
}

#[tauri::command]
pub fn save_model_config(models: Vec<ModelConfig>) -> Result<(), String> {
    info!("Save model config command called with {} models", models.len());
    let mut config = llm::load_config().map_err(|e| e.to_string())?;
    config.models = models;
    llm::save_config(&config).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
pub fn get_model_config() -> Result<llm::AppConfig, String> {
    info!("Get model config command called");
    llm::load_config().map_err(|e| e.to_string())
}
