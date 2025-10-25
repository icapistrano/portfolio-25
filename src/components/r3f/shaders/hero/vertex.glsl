attribute float attraction;

uniform vec3 uColor;
uniform float uMaxSize;
uniform float uMinSize;

varying vec3 vColor;

void main() {
  vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
  gl_Position = projectionMatrix * mvPosition;

  float size = mix(uMinSize, uMaxSize, attraction);
  gl_PointSize = size / -mvPosition.z;
  
  vColor = mix(vec3(1.0), uColor, attraction);
}