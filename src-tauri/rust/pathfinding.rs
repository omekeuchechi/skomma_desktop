use serde::Serialize;

/// A single waypoint along a computed route.
#[derive(Debug, Clone, Copy, Serialize)]
pub struct PathStep {
    pub x: f32,
    pub z: f32,
}

/// Computes a path between two world positions.
///
/// The current implementation returns a straight-line interpolation. Replace
/// this body with an A* / Jump Point Search grid walker when obstacles are
/// added to the world.
pub fn compute_path(from_x: f32, from_z: f32, to_x: f32, to_z: f32) -> Vec<PathStep> {
    const STEPS: usize = 16;

    (0..=STEPS)
        .map(|i| {
            let t = i as f32 / STEPS as f32;
            PathStep {
                x: from_x + (to_x - from_x) * t,
                z: from_z + (to_z - from_z) * t,
            }
        })
        .collect()
}
