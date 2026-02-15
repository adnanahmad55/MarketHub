import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; // 👈 1. Isse direct import karo

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
  doc.text(`Total Revenue: INR ${stats.totalRevenue.toLocaleString()}`, 14, 37);
  doc.text(`Total Transactions: ${stats.totalOrders}`, 14, 44);

  // 🛡️ FIX: doc.autoTable ki jagah autoTable(doc, ...) use karo
  autoTable(doc, {
    startY: 55,
    head: [["Date", "Product", "Seller", "Buyer", "Amount"]],
    body: salesData.map((sale) => [
      new Date(sale.order.createdAt).toLocaleDateString(),
      sale.product.name,
      sale.product.seller.name,
      sale.order.user.name,
      `INR ${sale.price * sale.quantity}`
    ]),
    headStyles: { fillStyle: [37, 99, 235], fontStyle: 'bold' },
    theme: 'striped',
    styles: { fontSize: 9, cellPadding: 4 }
  });

  doc.save(`MarketHub_Global_Report_${Date.now()}.pdf`);
};