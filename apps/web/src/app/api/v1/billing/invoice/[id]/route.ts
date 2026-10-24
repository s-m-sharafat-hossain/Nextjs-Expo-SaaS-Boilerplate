// apps/web/src/app/api/v1/billing/invoice/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/shared/lib/db";
import { auth } from "@/shared/lib/auth";
import { siteConfig } from "@shared/config";

interface RouteProps {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, props: RouteProps) {
  const { id } = await props.params;
  const session = await auth();

  if (!session?.user?.id) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  // Find transaction by invoiceNumber or id
  const transaction = await prisma.paymentTransaction.findFirst({
    where: {
      OR: [{ id }, { invoiceNumber: id }],
    },
    include: {
      user: {
        select: { id: true, name: true, email: true },
      },
    },
  });

  if (!transaction) {
    return new NextResponse("Invoice not found", { status: 404 });
  }

  const isSuperAdmin = (session.user as any)?.role === "SUPER_ADMIN";
  if (transaction.userId !== session.user.id && !isSuperAdmin) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  const formattedDate = new Date(transaction.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Invoice ${transaction.invoiceNumber} — ${siteConfig.name}</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; margin: 0; padding: 40px; color: #1e293b; background: #fff; }
    .container { max-width: 800px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px; padding: 40px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05); }
    .header { display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 2px solid #f1f5f9; padding-bottom: 24px; margin-bottom: 32px; }
    .brand { font-size: 24px; font-weight: 800; color: #4f46e5; }
    .invoice-title { font-size: 20px; font-weight: 700; text-align: right; }
    .meta { color: #64748b; font-size: 14px; margin-top: 4px; }
    .details { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin-bottom: 32px; font-size: 14px; }
    .table { width: 100%; border-collapse: collapse; margin-bottom: 32px; }
    .table th { background: #f8fafc; text-align: left; padding: 12px 16px; font-size: 13px; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #e2e8f0; }
    .table td { padding: 16px; border-bottom: 1px solid #f1f5f9; font-size: 14px; }
    .table .amount { text-align: right; }
    .totals { width: 300px; margin-left: auto; margin-bottom: 32px; }
    .totals-row { display: flex; justify-content: space-between; padding: 8px 0; font-size: 14px; color: #64748b; }
    .totals-row.final { border-top: 2px solid #e2e8f0; font-weight: 700; color: #0f172a; font-size: 18px; margin-top: 8px; padding-top: 12px; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 600; text-transform: uppercase; background: #dcfce7; color: #15803d; }
    .badge.PENDING { background: #fef9c3; color: #854d0e; }
    .badge.FAILED { background: #fee2e2; color: #b91c1c; }
    .actions { text-align: center; margin-top: 24px; }
    .print-btn { background: #4f46e5; color: #fff; border: none; padding: 10px 24px; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 14px; }
    @media print { .actions { display: none; } .container { border: none; box-shadow: none; padding: 0; } }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div>
        <div class="brand">${siteConfig.name}</div>
        <div class="meta">${siteConfig.description}</div>
      </div>
      <div>
        <div class="invoice-title">INVOICE</div>
        <div class="meta"><strong>#</strong> ${transaction.invoiceNumber}</div>
        <div class="meta"><strong>Date:</strong> ${formattedDate}</div>
        <div class="meta" style="margin-top: 6px;">
          <span class="badge ${transaction.status}">${transaction.status}</span>
        </div>
      </div>
    </div>

    <div class="details">
      <div>
        <strong>Billed To:</strong><br>
        ${transaction.user.name}<br>
        ${transaction.user.email}
      </div>
      <div style="text-align: right;">
        <strong>Payment Method:</strong><br>
        Gateway: ${transaction.gateway}<br>
        Currency: ${transaction.currency}
      </div>
    </div>

    <table class="table">
      <thead>
        <tr>
          <th>Description</th>
          <th class="amount">Qty</th>
          <th class="amount">Unit Price</th>
          <th class="amount">Total</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <strong>${transaction.planId ? `Plan: ${transaction.planId}` : "Platform Service"}</strong><br>
            <span class="meta">Invoice reference: ${transaction.invoiceNumber}</span>
          </td>
          <td class="amount">1</td>
          <td class="amount">${transaction.currency} ${transaction.baseAmount.toFixed(2)}</td>
          <td class="amount">${transaction.currency} ${transaction.baseAmount.toFixed(2)}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <div class="totals-row">
        <span>Subtotal</span>
        <span>${transaction.currency} ${transaction.baseAmount.toFixed(2)}</span>
      </div>
      ${transaction.discount > 0 ? `
      <div class="totals-row">
        <span>Discount (${transaction.couponCode || "Promo"})</span>
        <span>-${transaction.currency} ${transaction.discount.toFixed(2)}</span>
      </div>` : ""}
      <div class="totals-row">
        <span>Tax / VAT</span>
        <span>${transaction.currency} ${(transaction.taxAmount || 0).toFixed(2)}</span>
      </div>
      <div class="totals-row final">
        <span>Total Paid</span>
        <span>${transaction.currency} ${transaction.finalAmount.toFixed(2)}</span>
      </div>
    </div>

    <div class="actions">
      <button class="print-btn" onclick="window.print()">Print / Download PDF</button>
    </div>
  </div>
</body>
</html>`;

  return new NextResponse(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
    },
  });
}
