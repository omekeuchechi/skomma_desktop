/// Minimal physics helpers that mirror Babylon.js conventions so gameplay
/// math can be validated or offloaded to native code.
pub type Vec3 = (f32, f32, f32);

/// Integrates a projectile one timestep under gravity (units per second).
pub fn integrate_projectile(position: Vec3, velocity: Vec3, delta_time: f32) -> Vec3 {
    let dt = delta_time.max(0.0);
    (
        position.0 + velocity.0 * dt,
        position.1 + velocity.1 * dt - 0.5 * 9.81 * dt * dt,
        position.2 + velocity.2 * dt,
    )
}
