"use client";

import { generatePlatformReport } from "@/lib/generateReport";

export default function ReportButton({ allSalesData, stats }: { allSalesData: any[], stats: any }) {
  return (
    <button 
      onClick={() => generatePlatformReport(allSalesData, stats)}
      className="bg-black text-white px-6 py-3 rounded-2xl font-black flex items-center gap-2 hover:bg-gray-800 transition shadow-lg"
    >
      📥 Download Sales Report (PDF)
    </button>
  );
}