use serde_json::Value;

use crate::rust::{ai, chunk_generation, mesh, pathfinding, physics, procedural};

#[tauri::command]
pub fn compute_path(from_x: f32, from_z: f32, to_x: f32, to_z: f32) -> Vec<pathfinding::PathStep> {
    pathfinding::compute_path(from_x, from_z, to_x, to_z)
}

#[tauri::command]
pub fn generate_chunk(chunk_x: i32, chunk_z: i32, size: usize, seed: u64) -> Vec<f32> {
    chunk_generation::generate_chunk_heights(chunk_x, chunk_z, size, seed)
}

#[tauri::command]
pub fn ai_decision(state: Value) -> Value {
    ai::decide(&state)
}

#[tauri::command]
pub fn physics_projectile(
    position: (f32, f32, f32),
    velocity: (f32, f32, f32),
    delta_time: f32,
) -> (f32, f32, f32) {
    physics::integrate_projectile(position, velocity, delta_time)
}

#[tauri::command]
pub fn optimize_mesh(vertices: Vec<f32>, indices: Vec<u32>) -> mesh::MeshData {
    mesh::optimize(vertices, indices)
}

#[tauri::command]
pub fn procedural_height(x: f32, z: f32, seed: u64, octaves: u32) -> f32 {
    procedural::height(x, z, seed, octaves)
}

#[tauri::command]
pub fn process_webcam_frame(frame_data: Vec<u8>, width: u32, height: u32) -> Vec<u8> {
    // Placeholder for webcam frame processing in Rust
    // This could include image processing, compression, or optimization
    frame_data
}

#[tauri::command]
pub fn compute_movement_step(
    current_x: f32,
    current_y: f32,
    target_x: f32,
    target_y: f32,
    speed: f32,
) -> (f32, f32, bool) {
    let dx = target_x - current_x;
    let dy = target_y - current_y;
    let distance = (dx * dx + dy * dy).sqrt();
    
    if distance <= speed {
        (target_x, target_y, true) // Reached target
    } else {
        let new_x = current_x + (dx / distance) * speed;
        let new_y = current_y + (dy / distance) * speed;
        (new_x, new_y, false) // Still moving
    }
}

#[tauri::command]
pub fn compute_keyboard_movement(
    current_x: f32,
    current_y: f32,
    left: bool,
    right: bool,
    up: bool,
    down: bool,
    speed: f32,
) -> (f32, f32, bool) {
    let mut moved = false;
    let mut new_x = current_x;
    let mut new_y = current_y;
    
    if left {
        new_x -= speed;
        moved = true;
    }
    if right {
        new_x += speed;
        moved = true;
    }
    if up {
        new_y -= speed;
        moved = true;
    }
    if down {
        new_y += speed;
        moved = true;
    }
    
    (new_x, new_y, moved)
}
