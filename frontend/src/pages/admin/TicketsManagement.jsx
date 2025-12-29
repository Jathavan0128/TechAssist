// src/pages/admin/TicketsManagement.jsx
import { useEffect, useMemo, useState, useCallback, useRef } from "react";
import { getAllTickets, getTicketById, deleteTicket, updateTicket } from "../../services/ticketsService";

const ASC = "asc";
const DESC = "desc";

const STATUS_ORDER = ["Open", "In Progress", "Pending Review", "Escalated", "Resolved", "Closed"];
const STATUS_BADGE = {
  Open: "bg-blue-100 text-blue-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  "Pending Review": "bg-indigo-100 text-indigo-800",
  Escalated: "bg-red-100 text-red-800",
  Resolved: "bg-green-100 text-green-800",
  Closed: "bg-gray-100 text-gray-800",
};

function debounce(fn, wait = 300) {
  let t;
  return (...args) => {
    clearTimeout(t);
    t = setTimeout(() => fn(...args), wait);
  };
}

function Toast({ toast, dismiss }) {
  if (!toast) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 no-print">
      <div className="max-w-sm px-4 py-3 rounded-lg shadow-lg bg-white border flex items-start gap-3">
        <div className="text-sm">{toast.message}</div>
        <button onClick={dismiss} className="ml-4 text-gray-400 hover:text-gray-700">✕</button>
      </div>
    </div>
  );
}

function ConfirmDialog({ open, title, message, onCancel, onConfirm, warning }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-lg shadow-xl p-6 w-[460px]">
        <h3 className="text-lg font-bold text-blue-700">{title}</h3>
        <p className={`mt-2 text-sm ${warning ? "text-red-700" : "text-gray-700"}`}>{message}</p>
        <div className="mt-6 flex justify-end gap-3">
          <button onClick={onCancel} className="px-3 py-2 rounded-md border hover:bg-gray-50">Cancel</button>
          <button onClick={onConfirm} className={`px-3 py-2 rounded-md text-white ${warning ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"}`}>Confirm</button>
        </div>
      </div>
    </div>
  );
}

function TicketDetailModal({ ticket, loading, onClose, onUpdateStatus }) {
  if (!ticket && !loading) return null;

  const renderDepartment = (d) => !d ? "Unknown" : typeof d === "string" ? d : d.name || d.departmentName || "Unknown";
  const renderPriority = (p) => !p ? "Unknown" : typeof p === "string" ? p : p.name || "Unknown";

  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/40 no-print p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full overflow-auto">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-xl font-bold text-blue-700">Ticket Details</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">✕</button>
        </div>
        {loading ? (
          <div className="p-6 animate-pulse">Loading ticket...</div>
        ) : (
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-gray-500">Title</div>
                <div className="font-medium">{ticket.title}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Created By</div>
                <div className="font-medium">{ticket.createdBy?.name || "Unknown"}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Department</div>
                <div>{renderDepartment(ticket.department)}</div>
              </div>
              <div>
                <div className="text-xs text-gray-500">Priority</div>
                <div>{renderPriority(ticket.priority)}</div>
              </div>
            </div>
            <div>
              <div className="text-xs text-gray-500">Description</div>
              <div className="whitespace-pre-wrap">{ticket.description}</div>
            </div>
            <div className="flex items-center gap-4">
              <div>
                <div className="text-xs text-gray-500">Status</div>
                <span className={`px-3 py-1 rounded-full text-sm ${STATUS_BADGE[ticket.status] || "bg-gray-100 text-gray-800"}`}>
                  {ticket.status}
                </span>
              </div>
              <div className="ml-auto flex gap-2">
                <select defaultValue={ticket.status} onChange={(e) => onUpdateStatus(ticket._id, e.target.value)} className="border rounded px-2 py-1 text-sm">
                  {STATUS_ORDER.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="text-right">
              <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-800 text-white">Close</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Pagination({ page, perPage, total, onChange }) {
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const pages = [];
  const radius = 2;
  for (let i = Math.max(1, page - radius); i <= Math.min(totalPages, page + radius); i++) pages.push(i);

  return (
    <div className="flex items-center justify-between px-3 py-2 bg-white border-t no-print">
      <div className="text-sm text-gray-600">
        Showing <strong>{Math.min(total, (page - 1) * perPage + 1)}</strong> -
        <strong> {Math.min(total, page * perPage)}</strong> of <strong>{total}</strong>
      </div>
      <div className="flex items-center gap-2">
        <button disabled={page === 1} onClick={() => onChange(1)} className="px-2 py-1 border rounded">« First</button>
        <button disabled={page === 1} onClick={() => onChange(page - 1)} className="px-2 py-1 border rounded">‹ Prev</button>
        {pages.map((p) => (
          <button key={p} onClick={() => onChange(p)} className={`px-3 py-1 rounded ${p === page ? "bg-gray-800 text-white" : "border"}`}>{p}</button>
        ))}
        <button disabled={page === totalPages} onClick={() => onChange(page + 1)} className="px-2 py-1 border rounded">Next ›</button>
        <button disabled={page === totalPages} onClick={() => onChange(totalPages)} className="px-2 py-1 border rounded">Last »</button>
      </div>
    </div>
  );
}

export default function TicketsManagement() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [filterPriority, setFilterPriority] = useState("All");
  const [filterDept, setFilterDept] = useState("All");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState(DESC);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(10);
  const [selected, setSelected] = useState(new Set());
  const [selectAllPage, setSelectAllPage] = useState(false);
  const [viewingId, setViewingId] = useState(null);
  const [viewingTicket, setViewingTicket] = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmPayload, setConfirmPayload] = useState(null);
  const [toast, setToast] = useState(null);
  const showToast = (msg) => { setToast({ message: msg }); setTimeout(() => setToast(null), 3600); };

  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getAllTickets();
      setTickets(Array.isArray(res) ? res.map((t) => ({ ...t, createdAt: t.createdAt || t._createdAt || "" })) : []);
    } catch {
      showToast("Failed to load tickets.");
    } finally { setLoading(false); }
  }, []);
  useEffect(() => { loadTickets(); }, [loadTickets]);

  const departments = useMemo(() => {
    const map = new Map();
    tickets.forEach((t) => {
      const d = t.department;
      if (!d) return;
      if (typeof d === "string") map.set(d, { id: d, name: d });
      else {
        const id = String(d._id ?? d.id ?? d.departmentId ?? d.name);
        const name = d.name ?? d.departmentName ?? id;
        map.set(id, { id, name });
      }
    });
    return [{ id: "All", name: "All" }, ...Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))];
  }, [tickets]);

  const priorities = useMemo(() => {
    const map = new Map();
    tickets.forEach((t) => {
      const p = t.priority;
      if (!p) return;
      if (typeof p === "string") map.set(p, { id: p, name: p });
      else {
        const id = String(p._id ?? p.id ?? p.name);
        const name = p.name ?? String(p);
        map.set(id, { id, name });
      }
    });
    return [{ id: "All", name: "All" }, ...Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name))];
  }, [tickets]);

  const statuses = useMemo(() => {
    const s = new Set(tickets.map((t) => t.status).filter(Boolean));
    const arranged = STATUS_ORDER.filter((st) => s.has(st));
    const rest = Array.from(s).filter((x) => !STATUS_ORDER.includes(x)).sort();
    return ["All", ...arranged, ...rest];
  }, [tickets]);

  const debouncedSetSearch = useRef(debounce((v) => setSearchQuery(v), 300)).current;

  const filtered = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    let list = tickets.slice();
    if (filterStatus !== "All") list = list.filter((t) => t.status === filterStatus);
    if (filterPriority !== "All") list = list.filter((t) => {
      const p = t.priority;
      if (!p) return false;
      if (typeof p === "string") return String(p) === filterPriority;
      const pid = String(p._id ?? p.id ?? p.name);
      return pid === filterPriority;
    });
    if (filterDept !== "All") list = list.filter((t) => {
      const d = t.department;
      if (!d) return false;
      if (typeof d === "string") return String(d) === filterDept;
      const did = String(d._id ?? d.id ?? d.departmentId ?? d.name);
      return did === filterDept;
    });
    if (q.length > 0) {
      list = list.filter((t) => t.title?.toLowerCase().includes(q) || t.description?.toLowerCase().includes(q) || t.createdBy?.name?.toLowerCase().includes(q));
    }
    const getValue = (item, field) => {
      if (field === "createdBy") return item.createdBy?.name?.toLowerCase() || "";
      if (field === "priority") { const p = item.priority; return !p ? "" : (typeof p === "string" ? p : p.name ?? String(p)).toLowerCase(); }
      if (field === "department") { const d = item.department; return !d ? "" : (typeof d === "string" ? d : d.name ?? d.departmentName ?? "").toLowerCase(); }
      return (item[field]?.toString().toLowerCase()) || "";
    };
    list.sort((a, b) => { const A = getValue(a, sortBy); const B = getValue(b, sortBy); if (A === B) return 0; const order = A > B ? 1 : -1; return sortDir === ASC ? order : -order; });
    return list;
  }, [tickets, searchQuery, filterStatus, filterPriority, filterDept, sortBy, sortDir]);

  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / perPage));
  const safePage = Math.min(Math.max(1, page), totalPages);
  useEffect(() => { setPage((p) => Math.min(Math.max(1, p), Math.max(1, Math.ceil(filtered.length / perPage)))); }, [filtered.length, perPage]);
  const pageItems = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const toggleSelect = (id) => { setSelected((prev) => { const next = new Set(prev); next.has(id) ? next.delete(id) : next.add(id); return next; }); };
  const toggleSelectAllOnPage = () => {
    if (selectAllPage) { setSelected((prev) => { const next = new Set(prev); pageItems.forEach((it) => next.delete(it._id)); return next; }); setSelectAllPage(false); }
    else { setSelected((prev) => { const next = new Set(prev); pageItems.forEach((it) => next.add(it._id)); return next; }); setSelectAllPage(true); }
  };
  useEffect(() => { const someMissing = pageItems.some((it) => !selected.has(it._id)); if (someMissing && selectAllPage) setSelectAllPage(false); }, [pageItems, selected, selectAllPage]);

  const openView = async (id) => { setViewingId(id); setViewingTicket(null); setViewLoading(true); try { const ticket = await getTicketById(id); setViewingTicket(ticket); } catch { showToast("Failed to load ticket details"); } finally { setViewLoading(false); } };
  const closeView = () => { setViewingId(null); setViewingTicket(null); setViewLoading(false); };

  const initiateStatusChange = (id, newStatus) => {
    setConfirmPayload({ title: "Change ticket status", message: `Change status of this ticket to "${newStatus}"?`, warning: false,
      onConfirm: async () => {
        setConfirmOpen(false);
        try {
          const updated = await updateTicket(id, { status: newStatus });
          setTickets((prev) => prev.map((t) => (t._id === updated._id ? updated : t)));
          if (viewingId === updated._id) setViewingTicket(updated);
          showToast("Status changed");
        } catch { showToast("Failed to update status"); }
      }
    });
    setConfirmOpen(true);
  };

  const bulkUpdateStatus = (newStatus) => {
    if (!selected.size) return showToast("No tickets selected");
    setConfirmPayload({ title: "Bulk status update", message: `Change status of ${selected.size} ticket(s) to "${newStatus}"?`, warning: false,
      onConfirm: async () => {
        setConfirmOpen(false);
        const ids = Array.from(selected);
        try {
          await Promise.all(ids.map((id) => updateTicket(id, { status: newStatus })));
          setTickets((prev) => prev.map((t) => (selected.has(t._id) ? { ...t, status: newStatus } : t)));
          setSelected(new Set());
          showToast("Bulk update successful");
        } catch { showToast("Bulk update failed"); }
      }
    });
    setConfirmOpen(true);
  };

  const bulkDelete = () => {
    if (!selected.size) return showToast("No tickets selected");
    setConfirmPayload({ title: "Bulk delete tickets", message: `Permanently delete ${selected.size} ticket(s)? This cannot be undone.`, warning: true,
      onConfirm: async () => {
        setConfirmOpen(false);
        const ids = Array.from(selected);
        try { await Promise.all(ids.map((id) => deleteTicket(id))); setTickets((prev) => prev.filter((t) => !selected.has(t._id))); setSelected(new Set()); showToast("Tickets deleted"); } catch { showToast("Bulk delete failed"); }
      }
    });
    setConfirmOpen(true);
  };

  const singleDelete = (id) => {
    setConfirmPayload({ title: "Delete ticket", message: "Permanently delete this ticket? This cannot be undone.", warning: true,
      onConfirm: async () => {
        setConfirmOpen(false);
        try { await deleteTicket(id); setTickets((prev) => prev.filter((t) => t._id !== id)); if (viewingId === id) closeView(); showToast("Ticket deleted"); } catch { showToast("Failed to delete ticket"); }
      }
    });
    setConfirmOpen(true);
  };

  const downloadCSV = (filename, rows) => {
    if (!rows.length) return;
    const headers = Object.keys(rows[0]);
    const csv = [headers.join(","), ...rows.map((r) => headers.map((h) => `"${String(r[h] ?? "").replaceAll('"', '""')}"`).join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportCSV = () => {
    const rows = filtered.map((t) => {
      const dept = t.department;
      const deptName = typeof dept === "string" ? dept : dept?.name || dept?.departmentName || "";
      const pr = t.priority;
      const prName = typeof pr === "string" ? pr : pr?.name || "";
      return { id: t._id, title: t.title, description: t.description, status: t.status, priority: prName, department: deptName, createdBy: t.createdBy?.name || "", createdAt: t.createdAt || "" };
    });
    downloadCSV(`tickets_export_${new Date().toISOString().slice(0, 10)}.csv`, rows);
    showToast("CSV exported");
  };

  const exportPDFWithPrint = () => window.print();
  const toggleSort = (field) => { if (sortBy === field) setSortDir((d) => (d === ASC ? DESC : ASC)); else { setSortBy(field); setSortDir(DESC); } };
  const renderDepartment = (d) => !d ? "Unknown" : typeof d === "string" ? d : d.name || d.departmentName || "Unknown";
  const renderPriority = (p) => !p ? "Unknown" : typeof p === "string" ? p : p.name || "Unknown";

  return (
    <div className="p-6">
      <style>{`@media print {.no-print { display: none !important; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } .print-table { font-size: 12px; } }`}</style>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
        <h1 className="text-2xl font-bold text-blue-700">Admin • Tickets</h1>
        <div className="flex items-center gap-3 no-print">
          <button onClick={() => { setSelected(new Set()); setFilterDept("All"); setFilterPriority("All"); setFilterStatus("All"); setSearchQuery(""); showToast("Filters reset"); }} className="px-3 py-1 border rounded text-sm">Reset</button>
          <button onClick={exportCSV} className="px-3 py-1 bg-gray-800 text-white rounded text-sm">Export CSV</button>
          <button onClick={exportPDFWithPrint} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Print / Save as PDF</button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {STATUS_ORDER.map((s) => (
          <div key={s} className="bg-white border rounded-lg p-3 flex items-center gap-3">
            <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${STATUS_BADGE[s] || "bg-gray-100 text-gray-800"}`}>{s}</span>
            <div className="ml-auto text-right">
              <div className="text-xl font-bold text-blue-700">{tickets.filter((t) => t.status === s).length}</div>
              <div className="text-xs text-gray-500">tickets</div>
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4 no-print">
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white border rounded-lg px-3 py-1 shadow-sm">
            <svg className="w-5 h-5 text-gray-400 mr-2" viewBox="0 0 24 24" fill="none">
              <path d="M21 21l-4.35-4.35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <input type="search" placeholder="Search title, description, user..." onChange={(e) => debouncedSetSearch(e.target.value)} className="outline-none text-sm w-64" />
          </div>
          <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)} className="px-3 py-1 border rounded">{statuses.map((s) => <option key={s} value={s}>{s}</option>)}</select>
          <select value={filterPriority} onChange={(e) => setFilterPriority(e.target.value)} className="px-3 py-1 border rounded">{priorities.map((p) => <option key={p.id} value={p.id}>{p.name}</option>)}</select>
          <select value={filterDept} onChange={(e) => setFilterDept(e.target.value)} className="px-3 py-1 border rounded">{departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}</select>
        </div>
        <div className="text-sm text-gray-600"><strong>{total}</strong> results • Page <strong>{safePage}</strong> / <strong>{totalPages}</strong></div>
      </div>

      <div className="flex items-center justify-between bg-white border rounded-t-lg px-4 py-3 no-print">
        <div className="flex items-center gap-3">
          <label className="inline-flex items-center gap-2">
            <input type="checkbox" checked={pageItems.length > 0 && pageItems.every((p) => selected.has(p._id))} onChange={toggleSelectAllOnPage} />
            <span className="text-sm text-gray-700">Select page</span>
          </label>
          <select id="bulk-status" className="px-2 py-1 border rounded text-sm">
            <option value="">Bulk change status...</option>
            {STATUS_ORDER.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <button onClick={() => { const val = document.getElementById("bulk-status").value; if (val) bulkUpdateStatus(val); else showToast("Choose status"); }} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">Apply</button>
          <button onClick={bulkDelete} className="px-3 py-1 bg-red-600 text-white rounded text-sm">Delete Selected</button>
        </div>
        <div className="text-sm text-gray-600">Selected: <strong>{selected.size}</strong></div>
      </div>

      <div className="bg-white border-b border-l border-r border-gray-200 print-table">
        <table className="w-full table-fixed">
          <thead className="text-xs text-gray-600 bg-gray-50">
            <tr>
              <th className="p-3 w-12 text-left"></th>
              <th className="p-3 w-80 text-left cursor-pointer" onClick={() => toggleSort("title")}><span className="font-bold text-blue-700">Title</span> {sortBy==="title"?sortDir===DESC?"↓":"↑":""}</th>
              <th className="p-3 w-40 text-left cursor-pointer" onClick={() => toggleSort("createdBy")}><span className="font-bold text-blue-700">User</span></th>
              <th className="p-3 w-24 text-left cursor-pointer" onClick={() => toggleSort("priority")}><span className="font-bold text-blue-700">Priority</span></th>
              <th className="p-3 w-48 text-left"><span className="font-bold text-blue-700">Department</span></th>
              <th className="p-3 w-32 text-left cursor-pointer" onClick={() => toggleSort("status")}><span className="font-bold text-blue-700">Status</span></th>
              <th className="p-3 w-40 text-center no-print"><span className="font-bold text-blue-700">Actions</span></th>
            </tr>
          </thead>

          <tbody>
            {loading ? Array.from({length: perPage}).map((_,i)=>(<tr key={i} className="border-t">{Array.from({length:7}).map((_,j)=><td key={j} className="p-3"><div className="h-4 bg-gray-200 rounded w-full"></div></td>)}</tr>))
            : pageItems.length===0 ? <tr><td colSpan={7} className="p-8 text-center text-gray-500">No tickets found.</td></tr>
            : pageItems.map((t)=>(
              <tr key={t._id} className="border-t hover:bg-gray-50">
                <td className="p-3 no-print"><input type="checkbox" checked={selected.has(t._id)} onChange={()=>toggleSelect(t._id)}/></td>
                <td className="p-3"><div className="font-medium">{t.title}</div><div className="text-xs text-gray-500">{t.description?.slice(0,80)}</div></td>
                <td className="p-3"><div className="text-sm">{t.createdBy?.name||"Unknown"}</div><div className="text-xs text-gray-400">{t.createdAt?new Date(t.createdAt).toLocaleString():""}</div></td>
                <td className="p-3"><span className="px-2 py-1 rounded-full bg-gray-100 text-sm">{renderPriority(t.priority)}</span></td>
                <td className="p-3">{renderDepartment(t.department)}</td>
                <td className="p-3"><div className="flex items-center gap-2"><span className={`px-2 py-1 rounded-full text-sm ${STATUS_BADGE[t.status]||"bg-gray-100 text-gray-800"}`}>{t.status}</span><select value={t.status} onChange={(e)=>initiateStatusChange(t._id,e.target.value)} className="border rounded px-2 py-1 text-sm no-print">{STATUS_ORDER.map((s)=><option key={s} value={s}>{s}</option>)}</select></div></td>
                <td className="p-3 text-center no-print"><div className="flex items-center justify-center gap-3"><button onClick={()=>openView(t._id)} className="text-blue-600 text-sm hover:underline">View</button><button onClick={()=>singleDelete(t._id)} className="text-red-600 text-sm hover:underline">Delete</button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
        <Pagination page={safePage} perPage={perPage} total={total} onChange={(p)=>setPage(p)}/>
      </div>

      {viewingId && <TicketDetailModal ticket={viewingTicket} loading={viewLoading} onClose={closeView} onUpdateStatus={initiateStatusChange}/>}
      <ConfirmDialog open={confirmOpen} title={confirmPayload?.title||"Confirm"} message={confirmPayload?.message||""} warning={!!confirmPayload?.warning} onCancel={()=>setConfirmOpen(false)} onConfirm={()=>{confirmPayload?.onConfirm?.(); setConfirmPayload(null);}}/>
      <Toast toast={toast} dismiss={()=>setToast(null)}/>
    </div>
  );
}
