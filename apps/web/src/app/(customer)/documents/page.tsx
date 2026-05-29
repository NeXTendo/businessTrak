'use client';

import React, { useEffect, useState } from 'react';
import { createClient } from '../../../lib/supabase/client';
import { Card, Badge, Button } from '@chatowa/ui';
import { FolderOpen, FileText, Download, Receipt } from 'lucide-react';
import { format } from 'date-fns';

export default function CustomerDocumentsPage() {
  const [documents, setDocuments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    async function loadDocuments() {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data: customer } = await supabase
          .from('customers')
          .select('id')
          .eq('user_id', user.id)
          .single();

        if (customer) {
          // Fetch invoices
          const { data: invoices } = await supabase
            .from('invoices')
            .select('*')
            .eq('customer_id', customer.id);

          // Fetch receipts
          const { data: receipts } = await supabase
            .from('receipts')
            .select('*')
            .eq('customer_id', customer.id);

          const formattedDocs = [
            ...(invoices || []).map((inv: any) => ({
              id: inv.id,
              type: 'Invoice',
              number: inv.invoice_number,
              amount: inv.total_amount,
              currency: inv.currency,
              date: inv.created_at,
              status: inv.is_paid ? 'Paid' : 'Unpaid',
              pdfUrl: inv.pdf_url,
            })),
            ...(receipts || []).map((rec: any) => ({
              id: rec.id,
              type: 'Receipt',
              number: rec.receipt_number,
              amount: rec.amount_paid,
              currency: rec.currency,
              date: rec.created_at,
              status: 'Paid',
              pdfUrl: rec.pdf_url,
            })),
          ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

          setDocuments(formattedDocs);
        }
      } catch (err) {
        console.error('Error loading documents:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDocuments();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-10 w-48 bg-white rounded-lg animate-pulse" />
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-20 bg-white rounded-2xl animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-extrabold text-[#2C3E50] tracking-tight">My Documents</h1>
        <p className="text-[#BDC3C7]">Access and download your rental and sales invoices, agreements, and payment receipts.</p>
      </div>

      {documents.length > 0 ? (
        <Card className="border border-[#BDC3C7]/10 overflow-hidden bg-white">
          <div className="divide-y divide-[#BDC3C7]/10">
            {documents.map((doc) => (
              <div key={doc.id} className="p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:bg-[#F8F9FA] transition-colors">
                <div className="flex items-center space-x-4">
                  <div className={`p-3 rounded-xl ${
                    doc.type === 'Invoice' ? 'bg-[#E67E22]/10 text-[#E67E22]' : 'bg-green-500/10 text-green-500'
                  }`}>
                    {doc.type === 'Invoice' ? <FileText className="h-6 w-6" /> : <Receipt className="h-6 w-6" />}
                  </div>
                  <div>
                    <h3 className="font-bold text-[#2C3E50] flex items-center gap-2">
                      {doc.type} #{doc.number}
                    </h3>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#BDC3C7] mt-1 font-medium">
                      <span>Date: {format(new Date(doc.date), 'yyyy-MM-dd HH:mm')}</span>
                      <span>Amount: {doc.currency} {doc.amount?.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 self-end sm:self-auto">
                  <Badge variant={doc.status === 'Paid' ? 'success' : 'warning'}>{doc.status}</Badge>
                  {doc.pdfUrl ? (
                    <a href={doc.pdfUrl} target="_blank" rel="noopener noreferrer">
                      <Button variant="outline" size="sm" className="flex items-center space-x-1.5">
                        <Download className="h-4 w-4" />
                        <span>Download</span>
                      </Button>
                    </a>
                  ) : (
                    <Button variant="outline" size="sm" disabled className="opacity-50">
                      Processing
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-[#BDC3C7]/10 max-w-2xl mx-auto space-y-4">
          <FolderOpen className="h-12 w-12 text-[#BDC3C7] mx-auto" />
          <h2 className="text-lg font-bold text-[#2C3E50]">No Documents Available</h2>
          <p className="text-[#BDC3C7]">Any invoices or receipts generated for your rentals/purchases will appear here.</p>
        </div>
      )}
    </div>
  );
}