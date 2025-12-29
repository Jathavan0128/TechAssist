import { useState, useEffect, useCallback } from "react";
import { getTickets, createTicket, updateTicket, deleteTicket } from "../services/ticketsService";

export default function useTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await getTickets();
      setTickets(res.data || []);
    } catch (err) {
      console.error("Tickets load error:", err);
      setError("Failed to load tickets");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const add = async (data) => {
    try {
      const res = await createTicket(data);
      load();
      return res;
    } catch (err) {
      throw err;
    }
  };

  const edit = async (id, data) => {
    try {
      const res = await updateTicket(id, data);
      load();
      return res;
    } catch (err) {
      throw err;
    }
  };

  const remove = async (id) => {
    try {
      const res = await deleteTicket(id);
      load();
      return res;
    } catch (err) {
      throw err;
    }
  };

  return {
    tickets,
    loading,
    error,
    load,
    add,
    edit,
    remove,
  };
}
