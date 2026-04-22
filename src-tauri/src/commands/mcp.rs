use crate::mcp::{self, MCPServerConfig, MCPConnectionInfo};
use tracing::info;

#[tauri::command]
pub async fn connect_server(config: MCPServerConfig) -> Result<MCPConnectionInfo, String> {
    info!("Connect MCP server: {}", config.name);
    mcp::connect_mcp_server(&config).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn disconnect_server(name: String) -> Result<(), String> {
    info!("Disconnect MCP server: {}", name);
    mcp::disconnect_mcp_server(&name).await.map_err(|e| e.to_string())
}

#[tauri::command]
pub fn list_servers() -> Result<Vec<MCPServerConfig>, String> {
    info!("List MCP servers");
    mcp::load_mcp_servers().map_err(|e| e.to_string())
}

#[tauri::command]
pub async fn call_tool(
    server_name: String, 
    tool_name: String, 
    arguments: serde_json::Value
) -> Result<serde_json::Value, String> {
    info!("Call MCP tool: {} on {}", tool_name, server_name);
    mcp::call_mcp_tool(&server_name, &tool_name, arguments).await.map_err(|e| e.to_string())
}
