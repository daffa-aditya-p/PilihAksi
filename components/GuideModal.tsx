import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Target, MousePointer, Activity, Award } from 'lucide-react';

interface GuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GuideModal: React.FC<GuideModalProps> = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.9 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 pointer-events-none"
          >
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl p-8 pointer-events-auto relative">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-bold text-slate-800 mb-6">Cara Bermain</h2>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center shrink-0 text-blue-600">
                    <Target className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Tujuan Game</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Anda adalah Walikota baru. Tugas Anda adalah mengelola kota selama 10 putaran event. Jaga keseimbangan 4 indikator utama agar kota tetap stabil.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center shrink-0 text-purple-600">
                    <MousePointer className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Mengambil Keputusan</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Setiap event memiliki 2 pilihan. Pikirkan matang-matang! Setiap pilihan memiliki konsekuensi positif dan negatif terhadap statistik kota.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-green-100 flex items-center justify-center shrink-0 text-green-600">
                    <Activity className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Indikator</h3>
                    <ul className="text-sm text-slate-600 space-y-1 mt-1">
                      <li><span className="text-emerald-600 font-semibold">Lingkungan:</span> Kebersihan & alam.</li>
                      <li><span className="text-amber-600 font-semibold">Ekonomi:</span> Kekayaan kota.</li>
                      <li><span className="text-rose-600 font-semibold">Kebahagiaan:</span> Kepuasan warga.</li>
                      <li><span className="text-indigo-600 font-semibold">Pengetahuan:</span> Pendidikan & teknologi.</li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 text-orange-600">
                    <Award className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800">Hasil Akhir</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      Di akhir permainan, Anda akan mendapatkan gelar berdasarkan kondisi kota Anda. Apakah Anda akan menciptakan Utopia atau Dystopia?
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <button
                  onClick={onClose}
                  className="w-full bg-brand-600 text-white font-bold py-3 rounded-xl hover:bg-brand-700 transition-colors shadow-lg shadow-brand-500/30"
                >
                  Saya Siap!
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};