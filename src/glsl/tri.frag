uniform vec3 color;
uniform vec3 simpleCol;
uniform vec2 r;
uniform float alpha;
uniform float simpleColRate;
uniform float dotSize;
uniform float useDot;
uniform float shape;

varying vec2 vUv;

void main(void) {
  // float a = step(vUv.x, 0.5);
  // 形決め
  float a;
  if(shape == 0.0) a = step(vUv.x, 0.5);
  if(shape == 1.0) a = step(distance(vec2(0.5), vUv), 0.5);
  if(shape == 2.0) a = step(vUv.y, vUv.x * 0.5);

  vec2 p = (gl_FragCoord.xy*2.-r)/min(r.x,r.y);
  p *= 1.0;

  vec2 fr = fract(p);
  vec2 fl = floor(p);

  float m = mod(fl.x + fl.y, 2.0);
  float s = step(length(vec2(.5)-fr),.5);

  vec3 useCol = mix(color, 1.0 - simpleCol, simpleColRate);

  vec3 col;
  if(m==0.0) col = useCol;
  if(m==1.0) col = 1.0 - useCol;

  vec4 colA = vec4(col, s * a);
  vec4 colB = vec4(useCol, a);

  gl_FragColor = mix(colB, colA, useDot);
}
