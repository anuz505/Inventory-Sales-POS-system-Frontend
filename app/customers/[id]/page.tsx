import CustomerDetail from "@/components/customers/customerDetails";
import React from "react";

function CustomerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  return <CustomerDetail params={params} />;
}

export default CustomerDetailPage;
