// ==========================================
// AURORA BACKGROUND EFFECT
// WebGL-based animated gradient background
// Converted from React to vanilla JS
// ==========================================

class AuroraBackground {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      colorStops: options.colorStops || ['#FF6B6B', '#FFE66D', '#4ECDC4'],
      blend: options.blend || 0.5,
      amplitude: options.amplitude || 1.0,
      speed: options.speed || 0.5
    };
    
    this.canvas = null;
    this.gl = null;
    this.program = null;
    this.mesh = null;
    this.animateId = null;
    this.startTime = Date.now();
    
    this.init();
  }
  
  init() {
    // Create canvas
    this.canvas = document.createElement('canvas');
    this.canvas.style.position = 'fixed'; // Changed to fixed for full-page effect
    this.canvas.style.top = '0';
    this.canvas.style.left = '0';
    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';
    this.canvas.style.pointerEvents = 'none';
    this.canvas.style.zIndex = '-1'; // Behind everything
    this.canvas.style.opacity = '0.3'; // Much more subtle
    
    // Get WebGL context
    this.gl = this.canvas.getContext('webgl2', {
      alpha: true,
      premultipliedAlpha: true,
      antialias: true
    });
    
    if (!this.gl) {
      console.error('WebGL 2 not supported');
      return;
    }
    
    // Setup WebGL
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.enable(this.gl.BLEND);
    this.gl.blendFunc(this.gl.ONE, this.gl.ONE_MINUS_SRC_ALPHA);
    
    // Create shader program
    this.createProgram();
    
    // Create geometry
    this.createGeometry();
    
    // Append to container
    this.container.appendChild(this.canvas);
    
    // Handle resize
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Start animation
    this.animate();
  }
  
  createProgram() {
    const VERT = `#version 300 es
    in vec2 position;
    void main() {
      gl_Position = vec4(position, 0.0, 1.0);
    }`;
    
    const FRAG = `#version 300 es
    precision highp float;
    uniform float uTime;
    uniform float uAmplitude;
    uniform vec3 uColorStops[3];
    uniform vec2 uResolution;
    uniform float uBlend;
    out vec4 fragColor;
    
    vec3 permute(vec3 x) {
      return mod(((x * 34.0) + 1.0) * x, 289.0);
    }
    
    float snoise(vec2 v){
      const vec4 C = vec4(
          0.211324865405187, 0.366025403784439,
          -0.577350269189626, 0.024390243902439
      );
      vec2 i  = floor(v + dot(v, C.yy));
      vec2 x0 = v - i + dot(i, C.xx);
      vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
      vec4 x12 = x0.xyxy + C.xxzz;
      x12.xy -= i1;
      i = mod(i, 289.0);
      vec3 p = permute(
          permute(i.y + vec3(0.0, i1.y, 1.0))
        + i.x + vec3(0.0, i1.x, 1.0)
      );
      vec3 m = max(
          0.5 - vec3(
              dot(x0, x0),
              dot(x12.xy, x12.xy),
              dot(x12.zw, x12.zw)
          ), 
          0.0
      );
      m = m * m;
      m = m * m;
      vec3 x = 2.0 * fract(p * C.www) - 1.0;
      vec3 h = abs(x) - 0.5;
      vec3 ox = floor(x + 0.5);
      vec3 a0 = x - ox;
      m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
      vec3 g;
      g.x  = a0.x  * x0.x  + h.x  * x0.y;
      g.yz = a0.yz * x12.xz + h.yz * x12.yw;
      return 130.0 * dot(m, g);
    }
    
    struct ColorStop {
      vec3 color;
      float position;
    };
    
    #define COLOR_RAMP(colors, factor, finalColor) {              \\
      int index = 0;                                            \\
      for (int i = 0; i < 2; i++) {                               \\
         ColorStop currentColor = colors[i];                    \\
         bool isInBetween = currentColor.position <= factor;    \\
         index = int(mix(float(index), float(i), float(isInBetween))); \\
      }                                                         \\
      ColorStop currentColor = colors[index];                   \\
      ColorStop nextColor = colors[index + 1];                  \\
      float range = nextColor.position - currentColor.position; \\
      float lerpFactor = (factor - currentColor.position) / range; \\
      finalColor = mix(currentColor.color, nextColor.color, lerpFactor); \\
    }
    
    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution;
      
      ColorStop colors[3];
      colors[0] = ColorStop(uColorStops[0], 0.0);
      colors[1] = ColorStop(uColorStops[1], 0.5);
      colors[2] = ColorStop(uColorStops[2], 1.0);
      
      vec3 rampColor;
      COLOR_RAMP(colors, uv.x, rampColor);
      
      float height = snoise(vec2(uv.x * 2.0 + uTime * 0.1, uTime * 0.25)) * 0.5 * uAmplitude;
      height = exp(height);
      height = (uv.y * 2.0 - height + 0.2);
      float intensity = 0.6 * height;
      
      float midPoint = 0.20;
      float auroraAlpha = smoothstep(midPoint - uBlend * 0.5, midPoint + uBlend * 0.5, intensity);
      
      vec3 auroraColor = intensity * rampColor;
      
      fragColor = vec4(auroraColor * auroraAlpha, auroraAlpha);
    }`;
    
    // Compile shaders
    const vertexShader = this.compileShader(VERT, this.gl.VERTEX_SHADER);
    const fragmentShader = this.compileShader(FRAG, this.gl.FRAGMENT_SHADER);
    
    // Create program
    this.program = this.gl.createProgram();
    this.gl.attachShader(this.program, vertexShader);
    this.gl.attachShader(this.program, fragmentShader);
    this.gl.linkProgram(this.program);
    
    if (!this.gl.getProgramParameter(this.program, this.gl.LINK_STATUS)) {
      console.error('Program link error:', this.gl.getProgramInfoLog(this.program));
      return;
    }
    
    // Get uniform locations
    this.uniforms = {
      uTime: this.gl.getUniformLocation(this.program, 'uTime'),
      uAmplitude: this.gl.getUniformLocation(this.program, 'uAmplitude'),
      uColorStops: this.gl.getUniformLocation(this.program, 'uColorStops'),
      uResolution: this.gl.getUniformLocation(this.program, 'uResolution'),
      uBlend: this.gl.getUniformLocation(this.program, 'uBlend')
    };
  }
  
  compileShader(source, type) {
    const shader = this.gl.createShader(type);
    this.gl.shaderSource(shader, source);
    this.gl.compileShader(shader);
    
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile error:', this.gl.getShaderInfoLog(shader));
      this.gl.deleteShader(shader);
      return null;
    }
    
    return shader;
  }
  
  createGeometry() {
    // Full-screen triangle (covers entire viewport)
    const positions = new Float32Array([
      -1, -1,
      3, -1,
      -1, 3
    ]);
    
    const buffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, buffer);
    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
    
    this.positionLocation = this.gl.getAttribLocation(this.program, 'position');
  }
  
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255
    ] : [0, 0, 0];
  }
  
  resize() {
    const width = this.container.offsetWidth;
    const height = this.container.offsetHeight;
    this.canvas.width = width;
    this.canvas.height = height;
    this.gl.viewport(0, 0, width, height);
  }
  
  animate() {
    this.animateId = requestAnimationFrame(() => this.animate());
    
    const time = (Date.now() - this.startTime) * 0.001; // Convert to seconds
    
    // Clear
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    
    // Use program
    this.gl.useProgram(this.program);
    
    // Set uniforms
    this.gl.uniform1f(this.uniforms.uTime, time * this.options.speed);
    this.gl.uniform1f(this.uniforms.uAmplitude, this.options.amplitude);
    this.gl.uniform1f(this.uniforms.uBlend, this.options.blend);
    this.gl.uniform2f(this.uniforms.uResolution, this.canvas.width, this.canvas.height);
    
    // Color stops
    const colorStops = this.options.colorStops.map(hex => this.hexToRgb(hex)).flat();
    this.gl.uniform3fv(this.uniforms.uColorStops, colorStops);
    
    // Bind position attribute
    this.gl.enableVertexAttribArray(this.positionLocation);
    this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
    
    // Draw
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }
  
  destroy() {
    if (this.animateId) {
      cancelAnimationFrame(this.animateId);
    }
    if (this.canvas && this.canvas.parentNode) {
      this.canvas.parentNode.removeChild(this.canvas);
    }
    if (this.gl) {
      const ext = this.gl.getExtension('WEBGL_lose_context');
      if (ext) ext.loseContext();
    }
  }
  
  updateOptions(options) {
    this.options = { ...this.options, ...options };
  }
}

// ==========================================
// AUTO-INITIALIZE AURORA BACKGROUNDS
// ==========================================

document.addEventListener('DOMContentLoaded', () => {
  // Add Aurora background to BODY for full-page effect
  const body = document.body;
  
  // Create single full-page aurora
  const aurora = new AuroraBackground(body, {
    colorStops: ['#FF6B6B', '#141414', '#4ECDC4'], // Warm, soothing colors
    blend: 0.5, // More subtle
    amplitude: 0.8, // Gentler waves
    speed: 0.4 // Slower, calmer
  });
  
  console.log('✨ Aurora background initialized (full-page)');
});