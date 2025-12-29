import api from "../api/axios";

export const getMyTickets = async () => {
  const res = await api.get("/tickets/me");
  return res.data;
};

export const getAllTickets = async () => {
  const res = await api.get("/tickets");
  return res.data;
};

export const getTicketById = async (id) => {
  const res = await api.get(`/tickets/${id}`);
  return res.data;
};

export const createTicket = async (data) => {
  const res = await api.post("/tickets", data);
  return res.data;
};

export const updateTicket = async (id, data) => {
  const res = await api.patch(`/tickets/${id}`, data);
  return res.data;
};

export const deleteTicket = async (id) => {
  const res = await api.delete(`/tickets/${id}`);
  return res.data;
};

export const getTicketStats = async () => {
  const res = await api.get("/tickets/stats");
  return res.data;
};

export const getAdvancedStats = async () => {
  const res = await api.get("/tickets/stats/advanced");
  return res.data;
};

