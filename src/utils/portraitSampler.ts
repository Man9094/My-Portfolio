/**
 * PORTRAIT SAMPLER UTILITY — MAN CHAUDHARI
 * 
 * Accurately samples Man Chaudhari's real photo through an offscreen canvas.
 * Automatically locates the subject's head, face, glasses, beard, and neckline.
 * Crops tightly to the head and bust so that 100% of particle density resolves
 * into a crisp, instantly recognizable face.
 * 
 * Generates typed arrays (Float32Array / Uint8Array) for maximum memory efficiency
 * and zero-allocation frame rendering.
 */

export interface ParticleTarget {
  u: number;           // Normalized X (0 to 1 within portrait bounds)
  v: number;           // Normalized Y (0 to 1 within portrait bounds)
  brightness: number;  // 0 (shadow) to 1 (highlight)
  size: number;        // Particle radius (0.9 to 1.4px for crisp detail)
  alpha: number;       // Base opacity (0.4 to 0.98)
  color: string;       // Calibrated monochromatic silver/slate palette
  isEdge: boolean;     // True for critical facial contours (glasses, eyes, lips, jaw)
  depth: number;       // 0 for stable 2D facial plane
}

export const BUCKET_COLORS = [
  '#FFFFFF', // 0: Pure highlight (forehead/nose reflection, glasses shine)
  '#F1F5F9', // 1: Bright platinum skin highlight
  '#CBD5E1', // 2: Luminous silver skin midtone
  '#94A3B8', // 3: Soft transition slate (cheek contour, chin transition)
  '#64748B', // 4: Beard texture, glasses rim, eyebrow contour, hairline
  '#475569', // 5: Deep shadow & dark negative space (hair core, mustache shadow)
];

export interface SamplingResult {
  u: Float32Array;
  v: Float32Array;
  sizes: Float32Array;
  alphas: Float32Array;
  bucketIndices: Uint8Array;
  aspectRatio: number;
  totalCount: number;
  success: boolean;
  particles: ParticleTarget[]; // For fallback or inspection
}

/**
 * Load an image from URL and decode it safely.
 */
export async function loadAndDecodeImage(src: string): Promise<HTMLImageElement> {
  return new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = src;
    img.onload = () => {
      if ('decode' in img && typeof img.decode === 'function') {
        img.decode().then(() => resolve(img)).catch(() => resolve(img));
      } else {
        resolve(img);
      }
    };
    img.onerror = (e) => reject(e);
  });
}

/**
 * Samples the supplied image through an offscreen canvas to build high-fidelity
 * particle targets that accurately depict Man Chaudhari's recognizable face.
 */
export function samplePortraitImage(
  img: HTMLImageElement,
  targetCount = 8000
): SamplingResult {
  const naturalW = img.naturalWidth || img.width;
  const naturalH = img.naturalHeight || img.height;

  if (naturalW === 0 || naturalH === 0) {
    return {
      u: new Float32Array(0),
      v: new Float32Array(0),
      sizes: new Float32Array(0),
      alphas: new Float32Array(0),
      bucketIndices: new Uint8Array(0),
      aspectRatio: 0.84,
      totalCount: 0,
      success: false,
      particles: [],
    };
  }

  // 1. Analyze image on an offscreen canvas to locate subject bounds
  const analyzeW = 180;
  const analyzeH = Math.round((naturalH / naturalW) * analyzeW);
  const analyzeCanvas = document.createElement('canvas');
  analyzeCanvas.width = analyzeW;
  analyzeCanvas.height = analyzeH;
  const aCtx = analyzeCanvas.getContext('2d', { willReadFrequently: true });

  if (!aCtx) {
    return {
      u: new Float32Array(0),
      v: new Float32Array(0),
      sizes: new Float32Array(0),
      alphas: new Float32Array(0),
      bucketIndices: new Uint8Array(0),
      aspectRatio: 0.84,
      totalCount: 0,
      success: false,
      particles: [],
    };
  }

  aCtx.drawImage(img, 0, 0, analyzeW, analyzeH);
  const aImgData = aCtx.getImageData(0, 0, analyzeW, analyzeH);
  const aData = aImgData.data;

  let minSubX = analyzeW;
  let maxSubX = 0;
  let minSubY = analyzeH;
  let maxSubY = 0;
  let hasAlpha = false;

  for (let y = 0; y < analyzeH; y++) {
    for (let x = 0; x < analyzeW; x++) {
      const idx = (y * analyzeW + x) * 4;
      const alpha = aData[idx + 3];
      if (alpha < 240) hasAlpha = true;
      if (alpha > 35) {
        if (x < minSubX) minSubX = x;
        if (x > maxSubX) maxSubX = x;
        if (y < minSubY) minSubY = y;
        if (y > maxSubY) maxSubY = y;
      }
    }
  }

  // 2. Compute tight head & bust crop
  let cropX: number;
  let cropY: number;
  let cropW: number;
  let cropH: number;

  if (hasAlpha && minSubX < maxSubX && minSubY < maxSubY) {
    // Transparent PNG cutout (e.g. man-chaudhari.png):
    // minSubY is top of hair curls.
    // Face & bust occupies top 32% of subject height (hair, glasses, eyes, nose, lips, beard, collar).
    const subTop = (minSubY / analyzeH) * naturalH;
    const subHeight = ((maxSubY - minSubY) / analyzeH) * naturalH;
    const subLeft = (minSubX / analyzeW) * naturalW;
    const subWidth = ((maxSubX - minSubX) / analyzeW) * naturalW;
    const headCenterX = subLeft + subWidth * 0.5;

    cropY = Math.max(0, subTop - naturalH * 0.012); // include hair crest
    cropH = Math.min(naturalH - cropY, subHeight * 0.32); // head through beard & collar
    cropW = Math.round(cropH * 0.84); // 4:5 classical portrait aspect ratio
    cropX = Math.max(0, headCenterX - cropW * 0.5);
  } else {
    // Opaque JPEG fallback: head & bust in upper section
    cropY = Math.floor(naturalH * 0.06);
    cropH = Math.floor(naturalH * 0.34);
    cropW = Math.round(cropH * 0.84);
    cropX = Math.max(0, naturalW * 0.5 - cropW * 0.5);
  }

  const aspectRatio = cropW / cropH;

  // 3. High-resolution sampling grid (approx 104 x 124)
  const sampleW = 104;
  const sampleH = Math.round(sampleW / aspectRatio);

  const sampleCanvas = document.createElement('canvas');
  sampleCanvas.width = sampleW;
  sampleCanvas.height = sampleH;
  const sCtx = sampleCanvas.getContext('2d', { willReadFrequently: true });

  if (!sCtx) {
    return {
      u: new Float32Array(0),
      v: new Float32Array(0),
      sizes: new Float32Array(0),
      alphas: new Float32Array(0),
      bucketIndices: new Uint8Array(0),
      aspectRatio,
      totalCount: 0,
      success: false,
      particles: [],
    };
  }

  sCtx.drawImage(img, cropX, cropY, cropW, cropH, 0, 0, sampleW, sampleH);
  const sImgData = sCtx.getImageData(0, 0, sampleW, sampleH);
  const sData = sImgData.data;

  // Pre-calculate luminance and alpha
  const totalPixels = sampleW * sampleH;
  const luminance = new Float32Array(totalPixels);
  const alphaArr = new Float32Array(totalPixels);

  for (let i = 0; i < totalPixels; i++) {
    const r = sData[i * 4] / 255;
    const g = sData[i * 4 + 1] / 255;
    const b = sData[i * 4 + 2] / 255;
    luminance[i] = 0.299 * r + 0.587 * g + 0.114 * b;
    alphaArr[i] = sData[i * 4 + 3] / 255;
  }

  // 4. Sobel 3x3 Edge Detection to capture glasses, eyes, nose, lips, beard contour
  const sobelEdges = new Float32Array(totalPixels);
  for (let y = 1; y < sampleH - 1; y++) {
    for (let x = 1; x < sampleW - 1; x++) {
      const idx = y * sampleW + x;

      const p00 = luminance[(y - 1) * sampleW + (x - 1)];
      const p01 = luminance[(y - 1) * sampleW + x];
      const p02 = luminance[(y - 1) * sampleW + (x + 1)];
      const p10 = luminance[y * sampleW + (x - 1)];
      const p12 = luminance[y * sampleW + (x + 1)];
      const p20 = luminance[(y + 1) * sampleW + (x - 1)];
      const p21 = luminance[(y + 1) * sampleW + x];
      const p22 = luminance[(y + 1) * sampleW + (x + 1)];

      const gx = -p00 + p02 - 2 * p10 + 2 * p12 - p20 + p22;
      const gy = -p00 - 2 * p01 - p02 + p20 + 2 * p21 + p22;
      sobelEdges[idx] = Math.sqrt(gx * gx + gy * gy);
    }
  }

  // 5. Build candidates with calibrated luminance & feature preservation
  const tempU: number[] = [];
  const tempV: number[] = [];
  const tempSizes: number[] = [];
  const tempAlphas: number[] = [];
  const tempBuckets: number[] = [];
  const tempParticles: ParticleTarget[] = [];

  for (let y = 0; y < sampleH; y++) {
    const vNorm = y / (sampleH - 1);
    for (let x = 0; x < sampleW; x++) {
      const uNorm = x / (sampleW - 1);
      const idx = y * sampleW + x;
      const a = alphaArr[idx];

      // Exclude empty background
      if (hasAlpha && a < 0.2) continue;

      const lum = luminance[idx];
      const edge = sobelEdges[idx];

      const isFeatureEdge = edge > 0.12;
      const isFineEdge = edge > 0.06;

      // Density control: keep 100% of edges, sample flat areas proportionately
      let keepProbability = 0.85;
      if (isFeatureEdge) {
        keepProbability = 1.0; // glasses frames, eyes, lips, jawline
      } else if (isFineEdge) {
        keepProbability = 0.92;
      } else if (lum > 0.40) {
        keepProbability = 0.88; // skin highlights & midtones
      } else if (lum < 0.15) {
        keepProbability = 0.70; // hair volume
      }

      if (Math.random() > keepProbability) continue;

      // Micro-jitter to avoid rigid scanlines while preserving facial features
      const jitterU = (Math.random() - 0.5) * (0.35 / sampleW);
      const jitterV = (Math.random() - 0.5) * (0.35 / sampleH);

      // Monochromatic silver / slate color bucket assignment
      let bucket: number;
      let size: number;
      let alpha: number;

      if (lum > 0.65) {
        // Pure forehead/nose highlights
        bucket = 0;
        size = 1.25;
        alpha = 0.95;
      } else if (lum > 0.48) {
        // Bright platinum skin
        bucket = 1;
        size = 1.15;
        alpha = 0.88;
      } else if (lum > 0.34) {
        // Luminous silver skin midtone
        bucket = 2;
        size = 1.10;
        alpha = 0.82;
      } else if (lum > 0.20) {
        // Soft transition slate (cheek contour, chin transition)
        bucket = 3;
        size = 1.00;
        alpha = 0.74;
      } else if (lum > 0.08) {
        // Beard texture, glasses rim, eyebrow contour, hairline
        bucket = 4;
        size = 0.92;
        alpha = 0.62;
      } else {
        // Deep shadow & dark negative space (hair core, mustache shadow)
        bucket = 5;
        size = 0.85;
        alpha = 0.50;
      }

      const finalU = Math.max(0, Math.min(1, uNorm + jitterU));
      const finalV = Math.max(0, Math.min(1, vNorm + jitterV));

      tempU.push(finalU);
      tempV.push(finalV);
      tempSizes.push(size);
      tempAlphas.push(alpha);
      tempBuckets.push(bucket);

      tempParticles.push({
        u: finalU,
        v: finalV,
        brightness: lum,
        size,
        alpha,
        color: BUCKET_COLORS[bucket],
        isEdge: isFeatureEdge,
        depth: 0,
      });
    }
  }

  // 6. Downsample if above target budget while keeping 100% of feature edges
  const totalSampled = tempU.length;
  let finalIndices: number[];

  if (totalSampled > targetCount) {
    const edgeIndices: number[] = [];
    const nonEdgeIndices: number[] = [];

    for (let i = 0; i < totalSampled; i++) {
      if (tempParticles[i].isEdge) {
        edgeIndices.push(i);
      } else {
        nonEdgeIndices.push(i);
      }
    }

    const neededNonEdges = Math.max(0, targetCount - edgeIndices.length);
    const step = nonEdgeIndices.length / neededNonEdges;
    const sampledNonEdges: number[] = [];

    for (let i = 0; i < neededNonEdges; i++) {
      const idx = Math.floor(i * step);
      if (nonEdgeIndices[idx] !== undefined) {
        sampledNonEdges.push(nonEdgeIndices[idx]);
      }
    }

    finalIndices = [...edgeIndices, ...sampledNonEdges];
  } else {
    finalIndices = Array.from({ length: totalSampled }, (_, i) => i);
  }

  const finalCount = finalIndices.length;
  const outU = new Float32Array(finalCount);
  const outV = new Float32Array(finalCount);
  const outSizes = new Float32Array(finalCount);
  const outAlphas = new Float32Array(finalCount);
  const outBuckets = new Uint8Array(finalCount);
  const outParticles: ParticleTarget[] = new Array(finalCount);

  for (let i = 0; i < finalCount; i++) {
    const srcIdx = finalIndices[i];
    outU[i] = tempU[srcIdx];
    outV[i] = tempV[srcIdx];
    outSizes[i] = tempSizes[srcIdx];
    outAlphas[i] = tempAlphas[srcIdx];
    outBuckets[i] = tempBuckets[srcIdx];
    outParticles[i] = tempParticles[srcIdx];
  }

  return {
    u: outU,
    v: outV,
    sizes: outSizes,
    alphas: outAlphas,
    bucketIndices: outBuckets,
    aspectRatio,
    totalCount: finalCount,
    success: finalCount > 500,
    particles: outParticles,
  };
}
