/// Generates a heightmap for a single world chunk.
///
/// Returns `size * size` values row-major (x-major, then z) sampled from a
/// seeded value-noise field. This keeps heavy procedural math off the UI
/// thread and lets the world stream chunks on demand.
pub fn generate_chunk_heights(chunk_x: i32, chunk_z: i32, size: usize, seed: u64) -> Vec<f32> {
    let mut heights = Vec::with_capacity(size * size);
    for local_z in 0..size {
        for local_x in 0..size {
            let wx = chunk_x as f32 * size as f32 + local_x as f32;
            let wz = chunk_z as f32 * size as f32 + local_z as f32;
            heights.push(noise2d(wx, wz, seed));
        }
    }
    heights
}

fn hash(px: i32, pz: i32, seed: u64) -> f32 {
    let mut n = (px as i64)
        .wrapping_mul(374_761_393)
        .wrapping_add((pz as i64).wrapping_mul(668_265_263))
        .wrapping_add(seed as i64);
    n ^= n >> 13;
    n = n.wrapping_mul(1_274_126_177);
    n ^= n >> 16;
    (n as u64 % 10_000) as f32 / 10_000.0
}

/// 2D value noise with smooth interpolation, used by chunk and terrain math.
pub fn noise2d(x: f32, z: f32, seed: u64) -> f32 {
    let ix = x.floor() as i32;
    let iz = z.floor() as i32;
    let fx = x - ix as f32;
    let fz = z - iz as f32;

    let a = hash(ix, iz, seed);
    let b = hash(ix + 1, iz, seed);
    let c = hash(ix, iz + 1, seed);
    let d = hash(ix + 1, iz + 1, seed);

    let ux = fx * fx * (3.0 - 2.0 * fx);
    let uz = fz * fz * (3.0 - 2.0 * fz);

    a + (b - a) * ux + (c - a) * uz + (a - b - c + d) * ux * uz
}
