const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

async function generateIcons() {
  const publicDir = path.resolve(__dirname, '../public');
  const logoPath = path.join(publicDir, 'assets/sham-login-logo.webp');

  if (!fs.existsSync(logoPath)) {
    console.error('Logo not found at:', logoPath);
    process.exit(1);
  }

  const bgColor = { r: 11, g: 17, b: 33, alpha: 1 }; // #0B1121

  // 1. Generate 192x192 standard icon
  const logo192 = await sharp(logoPath)
    .resize(130, 130, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 192,
      height: 192,
      channels: 4,
      background: bgColor
    }
  })
    .composite([{ input: logo192, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, 'pwa-192x192.png'));
  console.log('Generated pwa-192x192.png');

  // 2. Generate 512x512 standard icon
  const logo512 = await sharp(logoPath)
    .resize(360, 360, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: bgColor
    }
  })
    .composite([{ input: logo512, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, 'pwa-512x512.png'));
  console.log('Generated pwa-512x512.png');

  // 3. Generate apple-touch-icon.png (180x180)
  const logo180 = await sharp(logoPath)
    .resize(120, 120, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 180,
      height: 180,
      channels: 4,
      background: bgColor
    }
  })
    .composite([{ input: logo180, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, 'apple-touch-icon.png'));
  console.log('Generated apple-touch-icon.png');

  // 4. Generate maskable 512x512 icon (with 20% safe zone padding)
  const logoMaskable = await sharp(logoPath)
    .resize(280, 280, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .toBuffer();

  await sharp({
    create: {
      width: 512,
      height: 512,
      channels: 4,
      background: bgColor
    }
  })
    .composite([{ input: logoMaskable, gravity: 'center' }])
    .png()
    .toFile(path.join(publicDir, 'pwa-maskable-512x512.png'));
  console.log('Generated pwa-maskable-512x512.png');

  // 5. Generate public/icon.svg
  const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="100" fill="#0B1121" />
  <defs>
    <linearGradient id="shamGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#4A90E2" />
      <stop offset="100%" stop-color="#2563EB" />
    </linearGradient>
    <radialGradient id="goldGrad" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#FCD34D" />
      <stop offset="100%" stop-color="#D97706" />
    </radialGradient>
  </defs>
  <circle cx="256" cy="256" r="190" stroke="url(#shamGrad)" stroke-width="8" fill="none" opacity="0.4" />
  <circle cx="256" cy="256" r="160" fill="#111B33" stroke="#4A90E2" stroke-width="4" />
  <!-- Syrian Eagle Emblem Silhouette / Wing shape -->
  <path d="M 256 140 L 290 200 L 370 210 L 310 260 L 330 340 L 256 300 L 182 340 L 202 260 L 142 210 L 222 200 Z" fill="url(#goldGrad)" opacity="0.9" />
  <!-- Stars -->
  <polygon points="230,230 236,248 254,248 240,258 245,276 230,266 215,276 220,258 206,248 224,248" fill="#10B981" />
  <polygon points="282,230 288,248 306,248 292,258 297,276 282,266 267,276 272,258 258,248 276,248" fill="#10B981" />
  <!-- Sham Text -->
  <text x="256" y="390" font-family="'Cairo', sans-serif" font-weight="bold" font-size="34" fill="#FFFFFF" text-anchor="middle" letter-spacing="2">شام كاش</text>
  <text x="256" y="420" font-family="'Cairo', sans-serif" font-weight="600" font-size="16" fill="#4A90E2" text-anchor="middle" letter-spacing="4">SHAMCHAS</text>
</svg>`;

  fs.writeFileSync(path.join(publicDir, 'icon.svg'), svgContent, 'utf8');
  console.log('Generated icon.svg');
}

generateIcons().catch(err => {
  console.error('Error generating icons:', err);
  process.exit(1);
});
