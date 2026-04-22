use crate::skills::{self, SkillInfo};
use tracing::info;

#[tauri::command]
pub fn list_skills() -> Result<Vec<SkillInfo>, String> {
    info!("List skills");
    skills::list_skills().map_err(|e| e.to_string())
}

#[tauri::command]
pub fn import_skill(source_path: String) -> Result<SkillInfo, String> {
    info!("Import skill from: {}", source_path);
    skills::import_local_skill(&source_path).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn import_from_github(repo_url: String) -> Result<SkillInfo, String> {
    info!("Import skill from GitHub: {}", repo_url);
    skills::import_from_github_repo(&repo_url).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn delete_skill(path: String) -> Result<(), String> {
    info!("Delete skill: {}", path);
    skills::delete_skill(&path).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn toggle_skill(path: String, enabled: bool) -> Result<(), String> {
    info!("Toggle skill {}: {}", path, enabled);
    skills::toggle_skill(&path, enabled).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_skill_path() -> Result<String, String> {
    skills::get_skills_base_path()
        .map(|p| p.to_string_lossy().to_string())
        .map_err(|e| e.to_string())
}
