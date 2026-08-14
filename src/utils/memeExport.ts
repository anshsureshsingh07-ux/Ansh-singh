import { AbsurdMeme } from '../types';

/**
 * Downloads a high-resolution, beautifully formatted social card of the Absurd Meme.
 * Uses native HTML5 Canvas rendering for 100% offline reliability, sharp text, and zero external asset lag.
 */
export function downloadMemeCard(meme: AbsurdMeme): void {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  // Set card canvas dimensions (standard 1080 x 1350 Instagram / Mobile format)
  const W = 1080;
  const H = 1350;
  canvas.width = W;
  canvas.height = H;

  // 1. Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, W, H);
  bgGrad.addColorStop(0, '#090d16');
  bgGrad.addColorStop(0.5, '#0f172a');
  bgGrad.addColorStop(1, '#050811');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, W, H);

  // 2. Decorative glowing borders & accent frame
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 6;
  ctx.strokeRect(36, 36, W - 72, H - 72);

  ctx.strokeStyle = 'rgba(245, 158, 11, 0.2)';
  ctx.lineWidth = 2;
  ctx.strokeRect(48, 48, W - 96, H - 96);

  // 3. Top Header Bar
  ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
  ctx.fillRect(52, 52, W - 104, 110);

  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 30px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(`🧠 ABSURDITY ZONE • ${meme.category.toUpperCase()}`, 80, 118);

  ctx.textAlign = 'right';
  ctx.fillStyle = '#94a3b8';
  ctx.font = '24px sans-serif';
  ctx.fillText('ANSH SINGH OFFICIAL', W - 80, 118);

  // 4. Character Emoji / Avatar
  ctx.textAlign = 'center';
  ctx.font = '100px sans-serif';
  ctx.fillText(meme.emojiAvatar, W / 2, 280);

  // 5. Character Name
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 44px serif';
  wrapText(ctx, meme.characterName, W / 2, 350, W - 160, 52, true);

  // 6. Dramatic Title
  ctx.fillStyle = '#f59e0b';
  ctx.font = 'bold 26px sans-serif';
  ctx.fillText(`— ${meme.title} —`, W / 2, 420);

  // 7. Dialogue Quote Box
  const quoteY = 470;
  ctx.fillStyle = 'rgba(30, 41, 59, 0.8)';
  ctx.fillRect(80, quoteY, W - 160, 140);
  ctx.strokeStyle = '#f59e0b';
  ctx.lineWidth = 3;
  ctx.strokeRect(80, quoteY, W - 160, 140);

  ctx.fillStyle = '#fef08a';
  ctx.font = 'italic bold 28px serif';
  wrapText(ctx, meme.dialogue, W / 2, quoteY + 60, W - 220, 38, true);

  // 8. Scenario / Description Box
  const descY = 640;
  ctx.fillStyle = 'rgba(15, 23, 42, 0.6)';
  ctx.fillRect(80, descY, W - 160, 180);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.3)';
  ctx.lineWidth = 1;
  ctx.strokeRect(80, descY, W - 160, 180);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText('SURREAL SCENARIO:', 105, descY + 40);

  ctx.fillStyle = '#e2e8f0';
  ctx.font = '26px sans-serif';
  wrapText(ctx, meme.description, 105, descY + 80, W - 210, 36, false);

  // 9. Fake Statistics Grid (4 boxes)
  const statsY = 850;
  const boxW = (W - 160 - 30) / 2;
  const boxH = 110;

  drawStatBox(ctx, 80, statsY, boxW, boxH, 'BRAINROT LEVEL', meme.brainrotLevel, '#ef4444');
  drawStatBox(ctx, 80 + boxW + 30, statsY, boxW, boxH, 'CHAOS ENERGY', meme.chaosEnergy, '#f59e0b');
  drawStatBox(ctx, 80, statsY + boxH + 20, boxW, boxH, 'LOGIC REMAINING', meme.logicRemaining, '#10b981');
  drawStatBox(ctx, 80 + boxW + 30, statsY + boxH + 20, boxW, boxH, 'POWER LEVEL', meme.powerLevel, '#8b5cf6');

  // 10. Plot Twist Callout Box
  const twistY = 1120;
  ctx.fillStyle = 'rgba(239, 68, 68, 0.15)';
  ctx.fillRect(80, twistY, W - 160, 100);
  ctx.strokeStyle = '#ef4444';
  ctx.lineWidth = 2;
  ctx.strokeRect(80, twistY, W - 160, 100);

  ctx.fillStyle = '#fca5a5';
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  wrapText(ctx, `⚠️ ${meme.plotTwist}`, W / 2, twistY + 55, W - 200, 32, true);

  // 11. Footer Watermark
  ctx.fillStyle = '#64748b';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('Generated at: https://singhanshsuresh.vercel.app/ • Non-Canon Absurdity Zone', W / 2, H - 56);

  // Convert to image download
  const link = document.createElement('a');
  const cleanName = meme.characterName.toLowerCase().replace(/[^a-z0-9]/g, '-').slice(0, 30);
  link.download = `absurd-meme-${cleanName}.png`;
  link.href = canvas.toDataURL('image/png');
  link.click();
}

function drawStatBox(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  label: string,
  value: string,
  accentColor: string
) {
  ctx.fillStyle = 'rgba(15, 23, 42, 0.9)';
  ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = 'rgba(148, 163, 184, 0.25)';
  ctx.lineWidth = 1;
  ctx.strokeRect(x, y, w, h);

  ctx.fillStyle = '#94a3b8';
  ctx.font = 'bold 18px sans-serif';
  ctx.textAlign = 'left';
  ctx.fillText(label, x + 20, y + 36);

  ctx.fillStyle = accentColor;
  ctx.font = 'bold 26px sans-serif';
  // If value is too long, truncate slightly
  const displayVal = value.length > 22 ? value.slice(0, 20) + '...' : value;
  ctx.fillText(displayVal, x + 20, y + 78);
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  isCenter: boolean
) {
  const words = text.split(' ');
  let line = '';
  let currentY = y;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      if (isCenter) {
        ctx.textAlign = 'center';
        ctx.fillText(line.trim(), x, currentY);
      } else {
        ctx.textAlign = 'left';
        ctx.fillText(line.trim(), x, currentY);
      }
      line = words[n] + ' ';
      currentY += lineHeight;
    } else {
      line = testLine;
    }
  }
  if (isCenter) {
    ctx.textAlign = 'center';
    ctx.fillText(line.trim(), x, currentY);
  } else {
    ctx.textAlign = 'left';
    ctx.fillText(line.trim(), x, currentY);
  }
}

/**
 * Copies formatted meme text to clipboard.
 */
export async function copyMemeText(meme: AbsurdMeme): Promise<boolean> {
  const text = `🧠 WELCOME TO THE ABSURDITY ZONE
━━━━━━━━━━━━━━━━━━━━
Character: ${meme.characterName}
Title: ${meme.title}
Category: ${meme.category} ${meme.categoryIcon}

💬 Quote: ${meme.dialogue}

📜 Scenario: ${meme.description}

📊 Stats:
• Brainrot Level: ${meme.brainrotLevel}
• Chaos Energy: ${meme.chaosEnergy}
• Logic Remaining: ${meme.logicRemaining}
• Power Level: ${meme.powerLevel}

⚠️ ${meme.plotTwist}
━━━━━━━━━━━━━━━━━━━━
Generated on Ansh Singh's Website: https://singhanshsuresh.vercel.app/`;

  try {
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    return false;
  } catch (e) {
    return false;
  }
}

/**
 * Shares meme via Web Share API or falls back to copy.
 */
export async function shareMeme(meme: AbsurdMeme): Promise<boolean> {
  const shareData = {
    title: `${meme.characterName} - Absurdity Zone`,
    text: `🧠 ${meme.characterName} (${meme.title}): ${meme.dialogue} - ${meme.plotTwist}`,
    url: 'https://singhanshsuresh.vercel.app/#absurdity-zone',
  };

  if (typeof navigator !== 'undefined' && navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (e) {
      return false;
    }
  } else {
    return await copyMemeText(meme);
  }
}
