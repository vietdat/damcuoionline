import React, { useRef, useEffect, useState } from 'react';
import useWeddingStore from '../../store/useWeddingStore.js';
import soundManager from '../../audio/soundManager.js';
import { X, Download, Award, Share2, Sparkles, Check } from 'lucide-react';

export function CertificateModal({ isOpen, onClose }) {
  const canvasRef = useRef(null);
  const [downloadUrl, setDownloadUrl] = useState(null);
  const [copied, setCopied] = useState(false);

  const {
    guestName,
    guestRole,
    guestGender,
    selectedOutfit,
    tables,
    selectedTableId,
    fullnessLevel
  } = useWeddingStore();

  const currentTable = tables.find((t) => t.id === selectedTableId) || tables[0];
  const cheersCount = currentTable.cheersCount || 0;

  // Render High-Resolution Certificate Canvas (1080 x 1350 px, 4:5 Instagram/Story ratio)
  useEffect(() => {
    if (!isOpen) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const W = 1080;
    const H = 1440;
    canvas.width = W;
    canvas.height = H;

    // ================= 1. LUXURIOUS DEEP VELVET WINE BACKGROUND =================
    const bgGrad = ctx.createRadialGradient(W / 2, 420, 100, W / 2, H / 2, 850);
    bgGrad.addColorStop(0, '#580A1A'); // Rich wine red center
    bgGrad.addColorStop(0.55, '#3B0712'); // Deep velvet burgundy
    bgGrad.addColorStop(1, '#150207'); // Midnight black cherry border
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle Golden Sparkle Stars scattered in background
    const drawSparkle = (x, y, r, alpha) => {
      ctx.save();
      ctx.fillStyle = `rgba(254, 240, 138, ${alpha})`;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();

      // 4-point sparkle flare for larger stars
      if (r > 3) {
        ctx.strokeStyle = `rgba(251, 191, 36, ${alpha * 0.8})`;
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(x - r * 3, y);
        ctx.lineTo(x + r * 3, y);
        ctx.moveTo(x, y - r * 3);
        ctx.lineTo(x, y + r * 3);
        ctx.stroke();
      }
      ctx.restore();
    };

    // Deterministic golden confetti positions
    const sparkleSeeds = [
      [120, 140, 3, 0.7], [220, 220, 5, 0.9], [880, 160, 4, 0.8], [940, 260, 3, 0.6],
      [140, 480, 4, 0.8], [960, 520, 5, 0.9], [100, 780, 3, 0.6], [980, 840, 4, 0.7],
      [180, 1100, 5, 0.9], [920, 1150, 4, 0.8], [260, 1320, 3, 0.6], [840, 1340, 4, 0.7],
      [540, 120, 3, 0.5], [380, 80, 4, 0.7], [700, 90, 4, 0.8], [480, 980, 3, 0.6]
    ];
    sparkleSeeds.forEach(([x, y, r, a]) => drawSparkle(x, y, r, a));

    // ================= 2. VIP PASS CONTOUR WITH TICKET NOTCHES =================
    const pad = 44;
    const cardW = W - pad * 2;
    const cardH = H - pad * 2;
    const notchY = 1000;
    const notchR = 26;

    // Draw Ticket Outer Path with Notches
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(pad + 36, pad);
    ctx.lineTo(W - pad - 36, pad);
    ctx.quadraticCurveTo(W - pad, pad, W - pad, pad + 36);
    // Right side top down to notch
    ctx.lineTo(W - pad, notchY - notchR);
    ctx.arc(W - pad, notchY, notchR, -Math.PI / 2, Math.PI / 2, true);
    ctx.lineTo(W - pad, H - pad - 36);
    ctx.quadraticCurveTo(W - pad, H - pad, W - pad - 36, H - pad);
    // Bottom
    ctx.lineTo(pad + 36, H - pad);
    ctx.quadraticCurveTo(pad, H - pad, pad, H - pad - 36);
    // Left side bottom up to notch
    ctx.lineTo(pad, notchY + notchR);
    ctx.arc(pad, notchY, notchR, Math.PI / 2, -Math.PI / 2, true);
    ctx.lineTo(pad, pad + 36);
    ctx.quadraticCurveTo(pad, pad, pad + 36, pad);
    ctx.closePath();

    // Golden foil border stroke
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 6;
    ctx.stroke();

    // Inner hairline border
    ctx.strokeStyle = 'rgba(253, 230, 138, 0.4)';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.restore();

    // Dashed Ticket Tear Line across notches
    ctx.save();
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
    ctx.lineWidth = 2;
    ctx.setLineDash([12, 10]);
    ctx.beginPath();
    ctx.moveTo(pad + notchR + 10, notchY);
    ctx.lineTo(W - pad - notchR - 10, notchY);
    ctx.stroke();
    ctx.restore();

    // ================= 3. TOP BRANDING & EVENT HEADER =================
    // Top VIP Badge Pill
    const pillW = 460;
    const pillH = 46;
    const pillX = (W - pillW) / 2;
    const pillY = 78;
    ctx.fillStyle = 'rgba(245, 158, 11, 0.15)';
    ctx.strokeStyle = '#F59E0B';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(pillX, pillY, pillW, pillH, 23);
    ctx.fill();
    ctx.stroke();

    ctx.font = '900 20px sans-serif';
    ctx.fillStyle = '#FEF08A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('★ OFFICIAL VIP WEDDING PASS ★', W / 2, pillY + pillH / 2);

    // Couple Name Headline
    ctx.font = '900 46px sans-serif';
    const coupleGrad = ctx.createLinearGradient(W / 2 - 280, 0, W / 2 + 280, 0);
    coupleGrad.addColorStop(0, '#FFFFFF');
    coupleGrad.addColorStop(0.5, '#FEF08A');
    coupleGrad.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = coupleGrad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.fillText('QUANG TRUNG  ♥  THÚY LAN', W / 2, 165);
    ctx.shadowBlur = 0;

    // Subtitle
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#FDE68A';
    ctx.fillText('HÔN LỄ TRỰC TUYẾN 3D  •  08.11.2026', W / 2, 212);

    // ================= 4. GUEST HERO VIP CARD =================
    const heroX = 85;
    const heroY = 250;
    const heroW = W - heroX * 2;
    const heroH = 340;

    // Glassmorphism Hero Panel
    ctx.fillStyle = 'rgba(10, 15, 30, 0.55)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.7)';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.roundRect(heroX, heroY, heroW, heroH, 30);
    ctx.fill();
    ctx.stroke();

    // Double Happiness (囍) Golden Medallion Crest
    ctx.save();
    const crestY = heroY + 54;
    ctx.fillStyle = '#F59E0B';
    ctx.beginPath();
    ctx.arc(W / 2, crestY, 36, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#7F1D1D';
    ctx.beginPath();
    ctx.arc(W / 2, crestY, 31, 0, Math.PI * 2);
    ctx.fill();

    ctx.font = 'bold 38px serif';
    ctx.fillStyle = '#FDE68A';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('囍', W / 2, crestY);
    ctx.restore();

    // Guest Tag
    ctx.font = 'bold 20px sans-serif';
    ctx.fillStyle = '#FED7AA';
    ctx.fillText('QUAN KHÁCH DANH DỰ', W / 2, heroY + 120);

    // Guest Name (Large, Bold, Eye-catching)
    ctx.font = '900 64px sans-serif';
    const nameGrad = ctx.createLinearGradient(W / 2 - 250, 0, W / 2 + 250, 0);
    nameGrad.addColorStop(0, '#FFFFFF');
    nameGrad.addColorStop(0.5, '#FDE68A');
    nameGrad.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = nameGrad;
    ctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    ctx.shadowBlur = 14;
    ctx.fillText(guestName || 'Bạn Khách Quý', W / 2, heroY + 185);
    ctx.shadowBlur = 0;

    // Playful Title Pill based on cheers count
    let titleText = '🥂 KHÁCH VIP ĂN CỖ NHIỆT TÌNH';
    if (cheersCount >= 80) {
      titleText = '🔥 CHIẾN THẦN BẤT KHẢ XỈN 🔥';
    } else if (cheersCount >= 40) {
      titleText = '🍻 TỬU LƯỢNG THẦN SẦU';
    } else if (fullnessLevel >= 80) {
      titleText = '🍗 CHIẾN HẠM VÉT SẠCH MÂM CỖ';
    }

    const titlePillW = 480;
    const titlePillH = 44;
    const titlePillX = (W - titlePillW) / 2;
    const titlePillY = heroY + 225;

    const pillGrad = ctx.createLinearGradient(titlePillX, 0, titlePillX + titlePillW, 0);
    pillGrad.addColorStop(0, '#DC2626');
    pillGrad.addColorStop(1, '#D97706');
    ctx.fillStyle = pillGrad;
    ctx.beginPath();
    ctx.roundRect(titlePillX, titlePillY, titlePillW, titlePillH, 22);
    ctx.fill();

    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = 1.5;
    ctx.stroke();

    ctx.font = '900 21px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText(titleText, W / 2, titlePillY + titlePillH / 2);

    // Guest Role Subtitle
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#E2E8F0';
    ctx.fillText(`Vai trò: ${guestRole || 'Khách VIP'}`, W / 2, heroY + 305);

    // ================= 5. VIRAL BANQUET STATS (3 MODERN CARDS) =================
    // Card 1: Top Wide Card (Cheers Count & Drinking Record)
    const stat1X = 85;
    const stat1Y = 615;
    const stat1W = W - stat1X * 2;
    const stat1H = 160;

    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.5)';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.roundRect(stat1X, stat1Y, stat1W, stat1H, 24);
    ctx.fill();
    ctx.stroke();

    // Beer Mug Icon
    ctx.font = '64px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText('🍻', stat1X + 35, stat1Y + 95);

    // Stat 1 Labels
    ctx.font = '900 24px sans-serif';
    ctx.fillStyle = '#FDE68A';
    ctx.fillText('TỔNG SỐ LY ĐÃ CẠN:', stat1X + 125, stat1Y + 62);

    ctx.font = 'medium 20px sans-serif';
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText('Cụng ly tơi bời, quẩy tới bến cùng bạn bè!', stat1X + 125, stat1Y + 105);

    // Stat 1 Value on Right
    ctx.textAlign = 'right';
    ctx.font = '900 56px sans-serif';
    const cheersGrad = ctx.createLinearGradient(stat1X + stat1W - 250, 0, stat1X + stat1W - 35, 0);
    cheersGrad.addColorStop(0, '#FEF08A');
    cheersGrad.addColorStop(1, '#F59E0B');
    ctx.fillStyle = cheersGrad;
    ctx.fillText(`${cheersCount} LY`, stat1X + stat1W - 35, stat1Y + 95);

    // Bottom Row: 2 Split Cards
    const statRowY = 795;
    const splitW = (stat1W - 24) / 2;
    const splitH = 175;

    // Card 2: Fullness Level
    const stat2X = stat1X;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(stat2X, statRowY, splitW, splitH, 24);
    ctx.fill();
    ctx.stroke();

    ctx.textAlign = 'left';
    ctx.font = '900 22px sans-serif';
    ctx.fillStyle = '#FDE68A';
    ctx.fillText('🍗  ĐỘ NO BỤNG:', stat2X + 28, statRowY + 48);

    ctx.font = '900 52px sans-serif';
    ctx.fillStyle = '#34D399';
    ctx.fillText(`${fullnessLevel}%`, stat2X + 28, statRowY + 112);

    ctx.font = 'bold 19px sans-serif';
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText(fullnessLevel >= 100 ? 'No nê mỹ mãn 🎉' : 'Đang thưởng cỗ ngon', stat2X + 28, statRowY + 148);

    // Card 3: Seated Table Name
    const stat3X = stat1X + splitW + 24;
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
    ctx.strokeStyle = 'rgba(245, 158, 11, 0.4)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(stat3X, statRowY, splitW, splitH, 24);
    ctx.fill();
    ctx.stroke();

    ctx.font = '900 22px sans-serif';
    ctx.fillStyle = '#FDE68A';
    ctx.fillText('🏛️  MÂM ĐÃ NGỒI:', stat3X + 28, statRowY + 48);

    ctx.font = '900 32px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    const tableName = currentTable.name || 'Mâm Cưới VIP';
    ctx.fillText(tableName.length > 16 ? tableName.slice(0, 15) + '…' : tableName, stat3X + 28, statRowY + 104);

    ctx.font = 'bold 19px sans-serif';
    ctx.fillStyle = '#CBD5E1';
    ctx.fillText('Đồng đội hết mình 🍻', stat3X + 28, statRowY + 148);

    // ================= 6. TICKET STUB & AUTHENTICATION (BELOW TEAR LINE) =================
    // Funny Brag Quote
    ctx.textAlign = 'center';
    ctx.font = 'italic bold 25px sans-serif';
    ctx.fillStyle = '#FEF08A';
    ctx.fillText('“Đã hoàn thành xuất sắc nhiệm vụ ăn cỗ online & quẩy banh nóc!”', W / 2, notchY + 68);

    // Simulated Decorative VIP Barcode (Left Side)
    const barcodeX = 95;
    const barcodeY = notchY + 130;
    const barcodeH = 65;
    ctx.save();
    ctx.fillStyle = '#FDE68A';
    // Draw 38 vertical bar strips
    const barWidths = [3, 6, 2, 8, 4, 2, 7, 3, 5, 2, 6, 4, 3, 7, 2, 5, 8, 3, 2, 6, 4, 7, 3, 5, 2, 8, 4, 3, 6, 2, 5, 7, 3, 4, 2, 6, 3, 5];
    let curBx = barcodeX;
    barWidths.forEach((bw, i) => {
      ctx.fillRect(curBx, barcodeY, bw, barcodeH);
      curBx += bw + (i % 2 === 0 ? 5 : 8);
    });
    ctx.restore();

    // Barcode Caption
    ctx.textAlign = 'left';
    ctx.font = 'bold 19px monospace';
    ctx.fillStyle = '#CBD5E1';
    const serial = `#VIP-PASS-2026-${String(Math.abs(cheersCount * 999 + 88888)).slice(0, 6)}`;
    ctx.fillText(serial, barcodeX, barcodeY + barcodeH + 28);
    ctx.font = 'bold 17px sans-serif';
    ctx.fillStyle = '#94A3B8';
    ctx.fillText('VERIFIED AUTHENTIC • DIDAMCUOIONLINE.VN', barcodeX, barcodeY + barcodeH + 52);

    // ================= 7. MEME WAX SEAL STAMP (TILTED AT -12°) =================
    ctx.save();
    ctx.translate(W - 220, notchY + 180);
    ctx.rotate(-0.2); // Tilted stamp effect

    // Red Wax Outer Ruffled Circle
    ctx.fillStyle = '#DC2626';
    ctx.beginPath();
    ctx.arc(0, 0, 88, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#FEE2E2';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Inner Ring
    ctx.strokeStyle = '#FEF08A';
    ctx.lineWidth = 2.5;
    ctx.beginPath();
    ctx.arc(0, 0, 74, 0, Math.PI * 2);
    ctx.stroke();

    // Stamp Content
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '900 20px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('CHIẾN THẦN', 0, -38);

    ctx.font = '900 32px sans-serif';
    ctx.fillStyle = '#FEF08A';
    ctx.fillText('ĂN CỖ 🍻', 0, 0);

    ctx.font = '900 18px sans-serif';
    ctx.fillStyle = '#FFFFFF';
    ctx.fillText('ĐÃ DUYỆT 囍', 0, 38);
    ctx.restore();

    // ================= 8. FOOTER HASHTAGS & COPYRIGHT =================
    ctx.textAlign = 'center';
    ctx.textBaseline = 'alphabetic';
    ctx.font = 'bold 22px sans-serif';
    ctx.fillStyle = '#F59E0B';
    ctx.fillText('#DiDamCuoiOnline3D   #ChienThanAnCo   #QuangTrungThuyLan', W / 2, H - 75);

    // Create Download URL
    try {
      const dataUrl = canvas.toDataURL('image/png');
      setDownloadUrl(dataUrl);
    } catch (e) {
      console.warn('Canvas export error:', e);
    }
  }, [isOpen, guestName, guestRole, currentTable.name, cheersCount, fullnessLevel]);

  if (!isOpen) return null;

  const handleDownload = () => {
    soundManager.playClick();
    if (!downloadUrl) return;

    const link = document.createElement('a');
    const safeName = (guestName || 'Khach').replace(/[^a-zA-Z0-9_\u00C0-\u024F\u1EA0-\u1EF9]/g, '_');
    link.download = `VIP_Pass_An_Co_${safeName}.png`;
    link.href = downloadUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleShare = () => {
    soundManager.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-slate-900 border-2 border-amber-400/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[95vh]">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-gradient-to-r from-red-950 via-slate-900 to-red-950 border-b border-amber-500/30">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-amber-400" />
            <h3 className="text-sm sm:text-base font-extrabold text-amber-300">
              Thẻ VIP Ăn Cỗ Thế Kỷ 🎫 ✨
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Certificate Preview Body */}
        <div className="flex-1 overflow-y-auto p-4 flex flex-col items-center justify-center bg-slate-950/60">
          <div className="w-full max-w-[360px] sm:max-w-[380px] rounded-2xl overflow-hidden shadow-2xl border-2 border-amber-400/60">
            <canvas ref={canvasRef} className="w-full h-auto block" />
          </div>
          <p className="text-[11px] text-amber-200/80 italic mt-2.5 text-center">
            ★ Tấm thẻ VIP flex càn quét cỗ cưới chuẩn Story (1080 × 1440) sẵn sàng tải về máy!
          </p>
        </div>

        {/* Bottom Actions Bar */}
        <div className="p-4 bg-slate-900 border-t border-slate-800 flex items-center gap-2.5">
          <button
            type="button"
            onClick={handleDownload}
            className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 hover:from-amber-400 hover:to-yellow-300 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-xl border border-white/60 flex items-center justify-center gap-2 transition active:scale-95 cursor-pointer"
          >
            <Download className="w-4 h-4" />
            <span>Tải Thẻ Về Máy (PNG)</span>
          </button>

          <button
            type="button"
            onClick={handleShare}
            className="py-3 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs sm:text-sm rounded-2xl border border-slate-700 transition flex items-center gap-1.5 cursor-pointer"
            title="Sao chép liên kết"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            <span className="hidden sm:inline">{copied ? 'Đã chép!' : 'Chia sẻ'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default CertificateModal;
