import { useEffect, useState } from "react";
import supabase from '../helper/supabaseClient';
import { useNavigate } from 'react-router';

function Dashboard() {
  const [invoices, setInvoices] = useState([]);

  const connectXero = () => {
    window.location.href = "/api/xero/login";
  };

  const loadInvoices = async () => {
    // Ensure tenantId is stored
    await fetch("/api/xero/connections");

    const res = await fetch("/api/xero/invoices");
    const data = await res.json();
    setInvoices(data?.Invoices || []);
  };

  return (
    <div>
      <h1>Dashboard</h1>

      <button onClick={connectXero}>
        Connect Xero
      </button>

      <button onClick={loadInvoices} style={{ marginLeft: 10 }}>
        Load Invoices
      </button>

      <ul>
        {invoices.map((inv) => (
          <li key={inv.InvoiceID}>
            {inv.Contact?.Name} — {inv.Total} ({inv.Status})
          </li>
        ))}
      </ul>
    </div>
  );

  
}

export default Dashboard;
