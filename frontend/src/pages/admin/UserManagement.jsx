import React, { useEffect, useState, useCallback, useMemo } from "react";
import { getUsers, updateUserRole } from "../../services/usersService";

const PAGE_SIZE = 10;


const getInitials = (name) => {
  if (!name) return "?";
  const parts = name.trim().split(/\s+/);
  return parts.length === 1
    ? parts[0].slice(0, 2).toUpperCase()
    : (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};


function ConfirmModal({
  open,
  title,
  message,
  onConfirm,
  onCancel,
  confirmLabel = "Confirm",
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black opacity-40" onClick={onCancel} />
      <div className="relative bg-white rounded-lg shadow-lg max-w-md w-full p-6 z-10">
        <h3 className="text-lg font-semibold mb-2">{title}</h3>
        <p className="text-sm text-gray-600 mb-4">{message}</p>
        <div className="flex justify-end gap-3">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded text-sm bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded text-sm bg-red-600 text-white hover:bg-red-700"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}


export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sortBy, setSortBy] = useState("createdAt");
  const [sortDir, setSortDir] = useState("desc");

  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmTarget, setConfirmTarget] = useState(null);

 
  const currentUser = useMemo(() => {
    try {
      const raw = localStorage.getItem("user");
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }, []);

  
  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search), 300);
    return () => clearTimeout(t);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortBy, sortDir]);

  
  const loadUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getUsers({
        page,
        limit: PAGE_SIZE,
        search: debouncedSearch,
        sortBy,
        sortDir,
      });

      const payload = res.data || {};
      setUsers(payload.data || []);
      setTotal(payload.total || 0);
      setPages(payload.pages || 1);
    } catch (err) {
      console.error("Failed to load users", err);
    } finally {
      setLoading(false);
    }
  }, [page, debouncedSearch, sortBy, sortDir]);

  
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

 
  const changeRole = async (id, newRole) => {
    try {
      setUpdatingId(id);
      await updateUserRole(id, { role: newRole });
      await loadUsers();
    } catch (err) {
      alert(err?.response?.data?.message || "Failed to update user role");
    } finally {
      setUpdatingId(null);
      setConfirmOpen(false);
      setConfirmTarget(null);
    }
  };

  const requestDemoteConfirm = (user) => {
    if (currentUser && String(currentUser._id) === String(user._id)) {
      alert("You cannot demote your own admin account.");
      return;
    }
    setConfirmTarget(user);
    setConfirmOpen(true);
  };

  const canModify = (user) => {
    if (!currentUser || currentUser.role !== "admin") return false;
    if (String(currentUser._id) === String(user._id)) return false;
    return true;
  };


  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">User Management</h1>

      {/* Search & Sort */}
      <div className="flex flex-col sm:flex-row sm:justify-between gap-3 mb-4">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name or email..."
          className="w-full sm:w-1/2 px-3 py-2 border rounded-md text-sm"
        />

        <div className="flex gap-2">
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="border px-2 py-1 rounded">
            <option value="createdAt">Created date</option>
            <option value="name">Name</option>
            <option value="role">Role</option>
          </select>
          <select value={sortDir} onChange={(e) => setSortDir(e.target.value)} className="border px-2 py-1 rounded">
            <option value="desc">Z → A</option>
            <option value="asc">A → Z</option>
          </select>
        </div>
      </div>

      {/* Users */}
      <div className="bg-white rounded-xl shadow divide-y">
        {loading && <div className="p-6 text-center text-gray-500">Loading users…</div>}
        {!loading && users.length === 0 && <div className="p-6 text-center text-gray-400">No users found</div>}

        {!loading &&
          users.map((u) => {
            const isAdmin = u.role === "admin";
            const isSelf = currentUser && currentUser._id === u._id;

            return (
              <div key={u._id} className="flex justify-between items-center p-4 hover:bg-gray-50">
                <div className="flex gap-4">
                  <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center font-semibold">
                    {getInitials(u.name)}
                  </div>
                  <div>
                    <div className="font-medium">{u.name}</div>
                    <div className="text-sm text-gray-500">{u.email}</div>
                  </div>
                </div>

                {isSelf ? (
                  <span className="text-sm text-gray-400">You</span>
                ) : isAdmin ? (
                  <button
                    onClick={() => requestDemoteConfirm(u)}
                    disabled={!canModify(u) || updatingId === u._id}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    Demote
                  </button>
                ) : (
                  <button
                    onClick={() => changeRole(u._id, "admin")}
                    disabled={updatingId === u._id}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm"
                  >
                    Promote
                  </button>
                )}
              </div>
            );
          })}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-between text-sm">
        <span>Page {page} of {pages} — {total} users</span>
        <div className="flex gap-2">
          <button disabled={page <= 1} onClick={() => setPage(p => p - 1)}>Prev</button>
          <button disabled={page >= pages} onClick={() => setPage(p => p + 1)}>Next</button>
        </div>
      </div>

      {/* Confirm Modal */}
      <ConfirmModal
        open={confirmOpen}
        title={`Demote ${confirmTarget?.name}?`}
        message="This action can be reversed later."
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => changeRole(confirmTarget._id, "employee")}
        confirmLabel="Demote"
      />
    </div>
  );
}


