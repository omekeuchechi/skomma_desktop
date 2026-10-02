use serde::Serialize;

/// Indexed triangle data ready to upload to the GPU.
#[derive(Debug, Serialize)]
pub struct MeshData {
    pub vertices: Vec<f32>,
    pub indices: Vec<u32>,
}

/// Placeholder mesh optimizer.
///
/// A real implementation should weld vertices within an epsilon, remove
/// degenerate triangles and rebuild the index buffer. The signature is stable
/// so the frontend can call it without changing the architecture.
pub fn optimize(vertices: Vec<f32>, indices: Vec<u32>) -> MeshData {
    MeshData { vertices, indices }
}
