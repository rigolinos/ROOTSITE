// ============================================
// Root Code — Utility Functions
// ============================================

/**
 * Linear interpolation between two values
 */
export function lerp(a, b, t) {
    return a + (b - a) * t;
}

/**
 * Clamp a value between min and max
 */
export function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

/**
 * Map a value from one range to another
 */
export function map(val, inMin, inMax, outMin, outMax) {
    return outMin + ((val - inMin) / (inMax - inMin)) * (outMax - outMin);
}

/**
 * Inverse lerp — returns the t value for a given value between a and b
 */
export function invLerp(a, b, v) {
    return clamp((v - a) / (b - a), 0, 1);
}

/**
 * Smoothstep interpolation
 */
export function smoothstep(edge0, edge1, x) {
    const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
    return t * t * (3 - 2 * t);
}

/**
 * Ease in-out cubic
 */
export function easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}

/**
 * Debounce function
 */
export function debounce(fn, ms) {
    let timer;
    return function (...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), ms);
    };
}

/**
 * Throttle function
 */
export function throttle(fn, ms) {
    let lastCall = 0;
    return function (...args) {
        const now = Date.now();
        if (now - lastCall >= ms) {
            lastCall = now;
            fn.apply(this, args);
        }
    };
}

/**
 * Get viewport dimensions
 */
export function getViewport() {
    return {
        width: window.innerWidth,
        height: window.innerHeight,
        aspect: window.innerWidth / window.innerHeight,
        pixelRatio: Math.min(window.devicePixelRatio, 2)
    };
}

/**
 * Simple 2D/3D noise for organic movement
 */
export function simpleNoise(x, y = 0, z = 0) {
    const n = Math.sin(x * 12.9898 + y * 78.233 + z * 45.164) * 43758.5453;
    return n - Math.floor(n);
}

/**
 * Random float between min and max
 */
export function randomRange(min, max) {
    return min + Math.random() * (max - min);
}

/**
 * Normalize angle to 0-2PI
 */
export function normalizeAngle(angle) {
    return ((angle % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
}

/**
 * Check if WebGL is supported
 */
export function isWebGLSupported() {
    try {
        const canvas = document.createElement('canvas');
        return !!(
            window.WebGLRenderingContext &&
            (canvas.getContext('webgl2') || canvas.getContext('webgl'))
        );
    } catch (e) {
        return false;
    }
}

/**
 * Color utilities
 */
export function hexToRGB(hex) {
    const r = parseInt(hex.slice(1, 3), 16) / 255;
    const g = parseInt(hex.slice(3, 5), 16) / 255;
    const b = parseInt(hex.slice(5, 7), 16) / 255;
    return { r, g, b };
}

export function hexToVec3(hex) {
    const { r, g, b } = hexToRGB(hex);
    return [r, g, b];
}

/**
 * Brand colors as normalized RGB
 */
export const COLORS = {
    primary: hexToVec3('#1B3022'),
    secondary: hexToVec3('#98A99A'),
    glow: hexToVec3('#4ADE80'),
    gold: hexToVec3('#C8A96E'),
    white: hexToVec3('#FFFFFF'),
    bgDark: hexToVec3('#0A0F0D'),
};

/**
 * Section count and progress helpers
 */
export const SECTION_COUNT = 8;

export function getSectionProgress(scrollProgress) {
    const sectionSize = 1 / SECTION_COUNT;
    const currentSection = Math.floor(scrollProgress / sectionSize);
    const sectionProgress = (scrollProgress % sectionSize) / sectionSize;
    return {
        index: clamp(currentSection, 0, SECTION_COUNT - 1),
        progress: clamp(sectionProgress, 0, 1)
    };
}
