use crate::rust::chunk_generation;

/// Fractal (fBm) height sampling used for terrain and decoration placement.
pub fn height(x: f32, z: f32, seed: u64, octaves: u32) -> f32 {
    let mut amplitude = 1.0;
    let mut frequency = 1.0;
    let mut total = 0.0;
    let mut max_value = 0.0;

    for _ in 0..octaves {
        total += chunk_generation::noise2d(x * frequency, z * frequency, seed) * amplitude;
        max_value += amplitude;
        amplitude *= 0.5;
        frequency *= 2.0;
    }

    total / max_value
}
