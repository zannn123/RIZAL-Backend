<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue';
import * as THREE from 'three';

const props = defineProps({
  className: { type: String, default: '' },
  style: { type: Object, default: () => ({}) },
  rotation: { type: Number, default: 45 },
  speed: { type: Number, default: 0.2 },
  colors: { type: Array, default: () => [] },
  transparent: { type: Boolean, default: true },
  autoRotate: { type: Number, default: 0 },
  scale: { type: Number, default: 1 },
  frequency: { type: Number, default: 1 },
  warpStrength: { type: Number, default: 1 },
  mouseInfluence: { type: Number, default: 1 },
  parallax: { type: Number, default: 0.5 },
  noise: { type: Number, default: 0.1 }
});

const MAX_COLORS = 8;

const frag = `
#define MAX_COLORS ${MAX_COLORS}
uniform vec2 uCanvas;
uniform float uTime;
uniform float uSpeed;
uniform vec2 uRot;
uniform int uColorCount;
uniform vec3 uColors[MAX_COLORS];
uniform int uTransparent;
uniform float uScale;
uniform float uFrequency;
uniform float uWarpStrength;
uniform vec2 uPointer; // in NDC [-1,1]
uniform float uMouseInfluence;
uniform float uParallax;
uniform float uNoise;
varying vec2 vUv;

void main() {
  float t = uTime * uSpeed;
  vec2 p = vUv * 2.0 - 1.0;
  p += uPointer * uParallax * 0.1;
  vec2 rp = vec2(p.x * uRot.x - p.y * uRot.y, p.x * uRot.y + p.y * uRot.x);
  vec2 q = vec2(rp.x * (uCanvas.x / uCanvas.y), rp.y);
  q /= max(uScale, 0.0001);
  q /= 0.5 + 0.2 * dot(q, q);
  q += 0.2 * cos(t) - 7.56;
  vec2 toward = (uPointer - rp);
  q += toward * uMouseInfluence * 0.2;

    vec3 col = vec3(0.0);
    float a = 1.0;

    if (uColorCount > 0) {
      vec2 s = q;
      vec3 sumCol = vec3(0.0);
      float cover = 0.0;
      for (int i = 0; i < MAX_COLORS; ++i) {
            if (i >= uColorCount) break;
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3); // strong response across 0..1
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0); // allow >1 to amplify displacement
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(i)) / 4.0);
            float m = mix(m0, m1, kMix);
            float w = 1.0 - exp(-6.0 / exp(6.0 * m));
            sumCol += uColors[i] * w;
            cover = max(cover, w);
      }
      col = clamp(sumCol, 0.0, 1.0);
      a = uTransparent > 0 ? cover : 1.0;
    } else {
        vec2 s = q;
        for (int k = 0; k < 3; ++k) {
            s -= 0.01;
            vec2 r = sin(1.5 * (s.yx * uFrequency) + 2.0 * cos(s * uFrequency));
            float m0 = length(r + sin(5.0 * r.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float kBelow = clamp(uWarpStrength, 0.0, 1.0);
            float kMix = pow(kBelow, 0.3);
            float gain = 1.0 + max(uWarpStrength - 1.0, 0.0);
            vec2 disp = (r - s) * kBelow;
            vec2 warped = s + disp * gain;
            float m1 = length(warped + sin(5.0 * warped.y * uFrequency - 3.0 * t + float(k)) / 4.0);
            float m = mix(m0, m1, kMix);
            col[k] = 1.0 - exp(-6.0 / exp(6.0 * m));
        }
        a = uTransparent > 0 ? max(max(col.r, col.g), col.b) : 1.0;
    }

    if (uNoise > 0.0001) {
      float n = fract(sin(dot(gl_FragCoord.xy + vec2(uTime), vec2(12.9898, 78.233))) * 43758.5453123);
      col += (n - 0.5) * uNoise;
      col = clamp(col, 0.0, 1.0);
    }

    vec3 rgb = (uTransparent > 0) ? col * a : col;
    gl_FragColor = vec4(rgb, a);
}
`;

const vert = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = vec4(position, 1.0);
}
`;

const containerRef = ref(null);
let renderer = null;
let material = null;
let rafId = null;
let resizeObserver = null;
let geometry = null;

const pointerTarget = new THREE.Vector2(0, 0);
const pointerCurrent = new THREE.Vector2(0, 0);
const pointerSmooth = 8;

const updateUniforms = () => {
    if (!material) return;
    
    material.uniforms.uSpeed.value = props.speed;
    material.uniforms.uScale.value = props.scale;
    material.uniforms.uFrequency.value = props.frequency;
    material.uniforms.uWarpStrength.value = props.warpStrength;
    material.uniforms.uMouseInfluence.value = props.mouseInfluence;
    material.uniforms.uParallax.value = props.parallax;
    material.uniforms.uNoise.value = props.noise;

    const toVec3 = (hex) => {
        const h = hex.replace('#', '').trim();
        const v =
            h.length === 3
                ? [parseInt(h[0] + h[0], 16), parseInt(h[1] + h[1], 16), parseInt(h[2] + h[2], 16)]
                : [parseInt(h.slice(0, 2), 16), parseInt(h.slice(2, 4), 16), parseInt(h.slice(4, 6), 16)];
        return new THREE.Vector3(v[0] / 255, v[1] / 255, v[2] / 255);
    };

    const arr = (props.colors || []).filter(Boolean).slice(0, MAX_COLORS).map(toVec3);
    for (let i = 0; i < MAX_COLORS; i++) {
        const vec = material.uniforms.uColors.value[i];
        if (i < arr.length) vec.copy(arr[i]);
        else vec.set(0, 0, 0);
    }
    
    material.uniforms.uColorCount.value = arr.length;
    material.uniforms.uTransparent.value = props.transparent ? 1 : 0;
    
    if (renderer) renderer.setClearColor(0x000000, props.transparent ? 0 : 1);
};

// Listen to prop changes to dynamically update uniforms
watch(() => [
    props.rotation, props.autoRotate, props.speed, props.scale,
    props.frequency, props.warpStrength, props.mouseInfluence,
    props.parallax, props.noise, props.colors, props.transparent
], updateUniforms, { deep: true });

onMounted(() => {
    const container = containerRef.current || containerRef.value;
    if (!container) return;

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    geometry = new THREE.PlaneGeometry(2, 2);
    const uColorsArray = Array.from({ length: MAX_COLORS }, () => new THREE.Vector3(0, 0, 0));
    
    material = new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        uniforms: {
            uCanvas: { value: new THREE.Vector2(1, 1) },
            uTime: { value: 0 },
            uSpeed: { value: props.speed },
            uRot: { value: new THREE.Vector2(1, 0) },
            uColorCount: { value: 0 },
            uColors: { value: uColorsArray },
            uTransparent: { value: props.transparent ? 1 : 0 },
            uScale: { value: props.scale },
            uFrequency: { value: props.frequency },
            uWarpStrength: { value: props.warpStrength },
            uPointer: { value: new THREE.Vector2(0, 0) },
            uMouseInfluence: { value: props.mouseInfluence },
            uParallax: { value: props.parallax },
            uNoise: { value: props.noise }
        },
        premultipliedAlpha: true,
        transparent: true
    });

    const mesh = new THREE.Mesh(geometry, material);
    scene.add(mesh);

    renderer = new THREE.WebGLRenderer({
        antialias: false,
        powerPreference: 'high-performance',
        alpha: true
    });
    
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setClearColor(0x000000, props.transparent ? 0 : 1);
    
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.display = 'block';
    
    container.appendChild(renderer.domElement);
    
    // Apply initial uniforms
    updateUniforms();

    const clock = new THREE.Clock();

    const handleResize = () => {
        if (!container || !renderer || !material) return;
        const w = container.clientWidth || window.innerWidth;
        const h = container.clientHeight || window.innerHeight;
        renderer.setSize(w, h, false);
        material.uniforms.uCanvas.value.set(w, h);
    };

    handleResize();

    if ('ResizeObserver' in window) {
        resizeObserver = new ResizeObserver(handleResize);
        resizeObserver.observe(container);
    } else {
        window.addEventListener('resize', handleResize);
    }

    const loop = () => {
        if (!material || !renderer) return;
        
        const dt = clock.getDelta();
        const elapsed = clock.elapsedTime;
        material.uniforms.uTime.value = elapsed;

        const deg = (props.rotation % 360) + props.autoRotate * elapsed;
        const rad = (deg * Math.PI) / 180;
        const c = Math.cos(rad);
        const s = Math.sin(rad);
        material.uniforms.uRot.value.set(c, s);

        const amt = Math.min(1, dt * pointerSmooth);
        pointerCurrent.lerp(pointerTarget, amt);
        material.uniforms.uPointer.value.copy(pointerCurrent);
        
        renderer.render(scene, camera);
        rafId = requestAnimationFrame(loop);
    };
    rafId = requestAnimationFrame(loop);

    const handlePointerMove = (e) => {
        if (!container) return;
        const rect = container.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / (rect.width || 1)) * 2 - 1;
        const y = -(((e.clientY - rect.top) / (rect.height || 1)) * 2 - 1);
        pointerTarget.set(x, y);
    };

    container.addEventListener('pointermove', handlePointerMove);

    onUnmounted(() => {
        if (rafId !== null) cancelAnimationFrame(rafId);
        if (resizeObserver) {
            resizeObserver.disconnect();
        } else {
            window.removeEventListener('resize', handleResize);
        }
        container.removeEventListener('pointermove', handlePointerMove);
        
        if (geometry) geometry.dispose();
        if (material) material.dispose();
        
        if (renderer) {
            renderer.dispose();
            if (renderer.domElement && renderer.domElement.parentElement === container) {
                container.removeChild(renderer.domElement);
            }
        }
    });
});
</script>

<template>
  <div ref="containerRef" :class="`color-bends-container ${className}`" :style="style"></div>
</template>

<style scoped>
.color-bends-container {
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>
