struct CameraUniform {
    view_proj: mat4x4<f32>,
};
@group(1) @binding(0)
var<uniform> camera: CameraUniform;

@group(2) @binding(0)
var<uniform> model: mat4x4<f32>;

struct VertexInput {
    @location(0) position: vec3<f32>,
    @location(1) normal: vec3<f32>,
};

struct VertexOutput {
    @builtin(position) vertex_position: vec4<f32>,
    @location(0) vertex_normal: vec4<f32>,
};

@vertex
fn vs_main(in: VertexInput) -> VertexOutput {
    var out: VertexOutput;
    out.vertex_normal = model * vec4<f32>(in.normal, 1.0);
    out.vertex_position = camera.view_proj * model * vec4<f32>(in.position, 1.0);
    return out;
}

@group(0) @binding(0)
var t_diffuse: texture_2d<f32>;
@group(0) @binding(1)
var s_diffuse: sampler;

@fragment
fn fs_main(in: VertexOutput) -> @location(0) vec4<f32> {
    var light_dir = vec3<f32>(-1.0, 0.0, 0.0);
    var dot = dot(light_dir, in.vertex_normal.xyz);
    return vec4<f32>(dot, dot, dot, 1.0);
}