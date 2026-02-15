import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export const generatePlatformReport = (salesData: any[], stats: any) => {
  const doc = new jsPDF();

  // Header Styling
  doc.setFontSize(22);
  doc.setTextColor(37, 99, 235);
  doc.text("MarketHub Sales Report", 14, 22);

  // Summary Info
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);
  // 👈 Fix 1: Stats fallback
  doc.text(`Total Revenue: INR ${(stats?.totalRevenue || 0).toLocaleString()}`, 14, 37);
  doc.text(`Total Transactions: ${stats?.totalOrders || 0}`, 14, 44);

  // 🛡️ FIX: Optional chaining taaki null data build na roke
  autoTable(doc, {
    startY: 55,
    head: [["Date", "Product", "Seller", "Buyer", "Amount"]],
    body: salesData.map((sale) => [
      // 👈 Fix 2: Har nested property par '?.' lagao
      sale.order?.createdAt ? new Date(sale.order.createdAt).toLocaleDateString() : "N/A",
      sale.product?.name || "Deleted Product",
      sale.product?.seller?.name || "Unknown Seller",
      sale.order?.user?.name || "Guest Buyer",
      `INR ${(sale.price || 0) * (sale.quantity || 0)}`
    ]),
    headStyles: { fillColor: [37, 99, 235], fontStyle: 'bold' }, // fillStyle ki jagah fillColor
    theme: 'striped',
    styles: { fontSize: 9, cellPadding: 4 }
  });

  doc.save(`MarketHub_Global_Report_${Date.now()}.pdf`);
};