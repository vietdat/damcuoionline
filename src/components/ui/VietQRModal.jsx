import React, { useState } from 'react';
import useWeddingStore from '../../store/useWeddingStore.js';
import soundManager from '../../audio/soundManager.js';
import { X, Copy, Check, QrCode, Heart, Sparkles } from 'lucide-react';

const PRESET_AMOUNTS = [
  { value: 68000, label: '68.000đ (Lộc Phát)' },
  { value: 168000, label: '168.000đ (Nhất Lộc Phát)' },
  { value: 500000, label: '500.000đ (Tình Bạn Tri Kỷ)' },
  { value: 999999, label: '999.999đ (Trăm Năm Hạnh Phúc)' },
];

export function VietQRModal() {
  const { isQRModalOpen, setQRModalOpen, guestName } = useWeddingStore();
  const [selectedAmount, setSelectedAmount] = useState(168000);
  const [copied, setCopied] = useState(false);

  if (!isQRModalOpen) return null;

  const bankName = 'MB Bank (Quân Đội)';
  const accountNumber = '0988889999';
  const accountHolder = 'NGUYEN QUANG TRUNG';
  const transferMessage = `Mung cuoi Trung Lan tu ${guestName || 'Ban'}`;

  // Generate dynamic VietQR API URL
  const qrUrl = `https://img.vietqr.io/image/MB-${accountNumber}-compact2.png?amount=${selectedAmount}&addInfo=${encodeURIComponent(
    transferMessage
  )}&accountName=${encodeURIComponent(accountHolder)}`;

  const handleCopy = () => {
    soundManager.playClick();
    navigator.clipboard?.writeText(accountNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleClose = () => {
    soundManager.playClick();
    setQRModalOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in pointer-events-auto">
      <div className="relative w-full max-w-md bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl border border-amber-500/40 p-5 shadow-2xl space-y-4">
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-red-950/80 border border-red-500/40 text-red-300 text-xs font-bold">
            <Heart className="w-3.5 h-3.5 fill-red-400 text-red-400" />
            <span>Mừng Cưới Online Trực Tiếp</span>
          </div>
          <h3 className="text-lg font-black text-white">Bắn Phong Bì Cho Dâu - Rể</h3>
          <p className="text-xs text-slate-400">
            Quét mã VietQR chuyển khoản thẳng vào tài khoản của Cô Dâu & Chú Rể
          </p>
        </div>

        {/* Amount Selector */}
        <div className="grid grid-cols-2 gap-2">
          {PRESET_AMOUNTS.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => {
                soundManager.playClick();
                setSelectedAmount(item.value);
              }}
              className={`p-2 rounded-xl text-xs font-semibold text-left transition border ${
                selectedAmount === item.value
                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-md'
                  : 'bg-slate-800/80 border-slate-700 text-slate-300 hover:bg-slate-700/80'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* QR Display Card */}
        <div className="flex flex-col items-center bg-white p-3.5 rounded-2xl shadow-inner">
          <img
            src={qrUrl}
            alt="VietQR Mừng Cưới"
            className="w-48 h-48 object-contain rounded-lg"
          />
          <p className="text-[11px] text-slate-600 font-medium mt-1">
            Số tiền: <strong className="text-red-600 text-xs">{selectedAmount.toLocaleString('vi-VN')} đ</strong>
          </p>
        </div>

        {/* Bank Details & Copy */}
        <div className="bg-slate-800/80 p-3 rounded-2xl border border-slate-700/80 text-xs space-y-1">
          <div className="flex justify-between text-slate-300">
            <span>Ngân hàng:</span>
            <strong className="text-white">{bankName}</strong>
          </div>
          <div className="flex justify-between items-center text-slate-300">
            <span>Số tài khoản:</span>
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1 font-mono font-bold text-amber-300 hover:text-amber-200 bg-slate-700/60 px-2 py-0.5 rounded-lg border border-slate-600"
            >
              <span>{accountNumber}</span>
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Chủ tài khoản:</span>
            <strong className="text-white">{accountHolder}</strong>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VietQRModal;
