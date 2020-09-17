uniform float time;
varying vec2 vUv;
// = object.matrixWorld
// uniform mat4 modelMatrix;

// = camera.matrixWorldInverse * object.matrixWorld
// uniform mat4 modelViewMatrix;

// = camera.projectionMatrix
// uniform mat4 projectionMatrix;

// = camera.matrixWorldInverse
// uniform mat4 viewMatrix;

// = inverse transpose of modelViewMatrix
// uniform mat3 normalMatrix;

// = camera position in world space
// uniform vec3 cameraPosition;

// default vertex attributes provided by Geometry and BufferGeometry
// attribute vec3 position;
// attribute vec3 normal;
// attribute vec2 uv;

void main() {
  vec3 posChanged = position;
  posChanged.x = posChanged.x * (abs(sin(time * 1.0)));
  posChanged.y = posChanged.y * (abs(cos(time * 1.0)));
  posChanged.z = posChanged.z * (abs(sin(time * 1.0)));
  // gl_Position = projectionMatrix * modelViewMatrix *
  // vec4(position*(abs(sin(time)/2.0)+0.5),1.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(posChanged, 1.0);
}
