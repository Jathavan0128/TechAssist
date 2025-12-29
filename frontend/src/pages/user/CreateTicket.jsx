// src/pages/tickets/CreateTicket.jsx
import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import TicketForm from "../../components/Tickets/TicketForm.jsx";
import { createTicket } from "../../services/ticketsService";
import { getDepartments } from "../../services/departmentsService";
import { getPriorities } from "../../services/prioritiesService";

export default function CreateTicket() {
  const [departments, setDepartments] = useState([]);
  const [priorities, setPriorities] = useState([]);
  const [loadingDropdowns, setLoadingDropdowns] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const loadDropdownData = useCallback(async (signal) => {
    setLoadingDropdowns(true);
    setError(null);

    try {
      const [depRes, prioRes] = await Promise.all([
        getDepartments({ signal }),
        getPriorities({ signal }),
      ]);

      const depList = Array.isArray(depRes?.data?.data)
        ? depRes.data.data
        : Array.isArray(depRes?.data)
        ? depRes.data
        : [];

      const prioList = Array.isArray(prioRes?.data) ? prioRes.data : [];

      if (!mountedRef.current) return;

      setDepartments(depList);
      setPriorities(prioList);
    } catch (err) {
      if (!mountedRef.current) return;
      if (err.name === "AbortError") return;

      setError("Failed to load departments or priorities. Please retry.");
      setDepartments([]);
      setPriorities([]);
    } finally {
      if (mountedRef.current) setLoadingDropdowns(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    loadDropdownData(controller.signal);
    return () => controller.abort();
  }, [loadDropdownData]);

  const handleSubmit = async (formData) => {
    if (!formData.title || !formData.department || !formData.priority) {
      alert("Please fill all required fields");
      return;
    }

    setLoadingSubmit(true);
    setError(null);

    try {
      await createTicket(formData);
      alert("Ticket created successfully!");
      navigate("/tickets", { replace: true });
    } catch (err) {
      const message =
        err?.response?.data?.message || err?.message || "Failed to create ticket.";
      setError(message);
      alert(message);
    } finally {
      if (mountedRef.current) setLoadingSubmit(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-100 p-6 flex justify-center">
      <div className="w-full max-w-4xl bg-white p-8 rounded-xl shadow">
        <h1 className="text-3xl font-bold mb-6">Create New Ticket</h1>

        {error && (
          <div className="mb-4 p-3 rounded border border-red-200 bg-red-50 text-red-800">
            <div className="flex items-center justify-between gap-4">
              <div>{error}</div>
              <button
                onClick={() => {
                  const controller = new AbortController();
                  loadDropdownData(controller.signal);
                }}
                className="px-3 py-1 bg-red-600 text-white rounded"
              >
                Retry
              </button>
            </div>
          </div>
        )}

        {loadingDropdowns ? (
          <div className="space-y-4">
            <div className="h-8 w-2/3 bg-gray-200 animate-pulse rounded" />
            <div className="h-36 bg-gray-200 animate-pulse rounded" />
            <div className="h-12 bg-gray-200 animate-pulse rounded" />
          </div>
        ) : (
          <TicketForm
            onSubmit={handleSubmit}
            departmentOptions={departments}
            priorityOptions={priorities}
            loading={loadingSubmit}
          />
        )}
      </div>
    </div>
  );
}
