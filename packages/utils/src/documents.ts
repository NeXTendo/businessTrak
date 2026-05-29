export const buildContractData = (rental: object, customer: object, vehicle: object) =>
  ({ rental, customer, vehicle, generatedAt: new Date().toISOString() });
export const buildInvoiceData  = (invoice: object, customer: object, items: unknown[]) =>
  ({ invoice, customer, items, generatedAt: new Date().toISOString() });
export const buildReceiptData  = (receipt: object, customer: object) =>
  ({ receipt, customer, generatedAt: new Date().toISOString() });