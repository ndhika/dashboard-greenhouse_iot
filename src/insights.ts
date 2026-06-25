import type { DashboardElements } from './ui/renderDashboard';

export function updateLiveInsight(
  elements: DashboardElements,
  suhuNum: number,
  kelNum: number,
  cahNum: number
): void {
  if (cahNum < 1500 && suhuNum > 31) {
    elements.insightCard.className = 'lg:col-span-1 bg-red-50 border border-red-200 rounded-2xl p-6 shadow-sm transition-colors duration-500 flex flex-col h-full relative overflow-hidden';
    elements.insightIconBox.className = 'w-12 h-12 rounded-full bg-red-100 flex-shrink-0 flex items-center justify-center text-red-600 transition-colors duration-500';
    elements.insightIcon.className = 'fa-solid fa-fire text-xl animate-bounce';
    elements.insightBgIcon.className = 'fa-solid fa-triangle-exclamation absolute -right-6 -bottom-6 text-9xl text-red-500 opacity-5 transition-colors duration-500';
    elements.insightTitle.className = 'text-sm font-bold text-red-800 tracking-wide uppercase leading-tight';
    elements.insightText.className = 'text-sm text-red-700 font-medium leading-relaxed flex-1 relative z-10';
    elements.insightTitle.innerText = 'KONDISI KRITIS';
    elements.insightText.innerHTML = `Suhu udara melonjak tajam ke <b>${suhuNum}°C</b>! Panas terperangkap karena atap tertutup.<br><br><span class="text-red-800 font-semibold"><i class="fa-solid fa-triangle-exclamation mr-1"></i> Peringatan:</span><br>Tanaman sangat berisiko mengalami dehidrasi dan layu permanen. Segera buka atap untuk mengalirkan sirkulasi udara!`;
    return;
  }

  if (cahNum >= 1500 && suhuNum <= 29) {
    elements.insightCard.className = 'lg:col-span-1 bg-green-50 border border-green-200 rounded-2xl p-6 shadow-sm transition-colors duration-500 flex flex-col h-full relative overflow-hidden';
    elements.insightIconBox.className = 'w-12 h-12 rounded-full bg-green-100 flex-shrink-0 flex items-center justify-center text-green-600 transition-colors duration-500';
    elements.insightIcon.className = 'fa-solid fa-leaf text-xl';
    elements.insightBgIcon.className = 'fa-brands fa-envira absolute -right-6 -bottom-6 text-9xl text-green-500 opacity-5 transition-colors duration-500';
    elements.insightTitle.className = 'text-sm font-bold text-green-800 tracking-wide uppercase leading-tight';
    elements.insightText.className = 'text-sm text-green-700 font-medium leading-relaxed flex-1 relative z-10';
    elements.insightTitle.innerText = 'KONDISI OPTIMAL';
    elements.insightText.innerHTML = `Lingkungan sangat seimbang. Suhu sejuk <b>${suhuNum}°C</b> dan paparan cahaya matahari sangat melimpah.<br><br><span class="text-green-800 font-semibold"><i class="fa-solid fa-check-circle mr-1"></i> Dampak:</span><br>Proses fotosintesis dan bukaan stomata daun berjalan dengan sangat sempurna.`;
    return;
  }

  elements.insightCard.className = 'lg:col-span-1 bg-blue-50 border border-blue-200 rounded-2xl p-6 shadow-sm transition-colors duration-500 flex flex-col h-full relative overflow-hidden';
  elements.insightIconBox.className = 'w-12 h-12 rounded-full bg-blue-100 flex-shrink-0 flex items-center justify-center text-blue-600 transition-colors duration-500';
  elements.insightIcon.className = 'fa-solid fa-temperature-arrow-up text-xl';
  elements.insightBgIcon.className = 'fa-solid fa-temperature-half absolute -right-6 -bottom-6 text-9xl text-blue-500 opacity-5 transition-colors duration-500';
  elements.insightTitle.className = 'text-sm font-bold text-blue-800 tracking-wide uppercase leading-tight';
  elements.insightText.className = 'text-sm text-blue-700 font-medium leading-relaxed flex-1 relative z-10';
  elements.insightTitle.innerText = 'TRANSISI LINGKUNGAN';
  elements.insightText.innerHTML = `Suhu sedang beradaptasi. Tingkat kelembaban udara saat ini berada di <b>${kelNum}%</b>.<br><br><span class="text-blue-800 font-semibold"><i class="fa-solid fa-eye mr-1"></i> Tindakan:</span><br>Sistem terus memantau pergerakan udara secara real-time.`;
}
