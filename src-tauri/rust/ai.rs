use serde_json::{json, Value};

/// Lightweight decision logic for NPC behaviour.
///
/// Reads a flat JSON state blob and returns an action. Extend with utility
/// functions (line of sight, distance checks) without touching the command
/// layer.
pub fn decide(state: &Value) -> Value {
    let threat = state
        .get("threat")
        .and_then(Value::as_f64)
        .unwrap_or(0.0);

    if threat > 0.7 {
        json!({ "action": "flee", "priority": 1.0 })
    } else if threat > 0.3 {
        json!({ "action": "cautious", "priority": 0.5 })
    } else {
        json!({ "action": "idle", "priority": 0.0 })
    }
}
