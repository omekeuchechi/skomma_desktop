mod commands;

#[path = "../rust/mod.rs"]
mod rust;

pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_store::Builder::new().build())
        .plugin(tauri_plugin_updater::Builder::new().build())
        .invoke_handler(tauri::generate_handler![
            commands::compute_path,
            commands::generate_chunk,
            commands::ai_decision,
            commands::physics_projectile,
            commands::optimize_mesh,
            commands::procedural_height,
            commands::process_webcam_frame,
            commands::compute_movement_step,
            commands::compute_keyboard_movement,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
