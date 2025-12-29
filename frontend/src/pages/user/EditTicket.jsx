import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import TicketForm from "../../components/Tickets/TicketForm";
import {
  getTicketById,
  updateTicket,
} from "../../services/ticketsService";

import { getDepartments } from "../../services/departmentsService";

export default function EditTicket() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    departmentId: "",
    priority: "",
  });

  const [errors, setErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load ticket + departments
  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: ticket }, { data: deptList }] = await Promise.all([
          getTicketById(id),
          getDepartments(),
        ]);

        setDepartments(deptList);

        // Convert backend department NAME → ID
        const dept = deptList.find((d) => d.name === ticket.department);

        setForm({
          title: ticket.title,
          description: ticket.description,
          departmentId: dept?._id || "",
          priority: ticket.priority,
        });
      } catch (err) {
        console.error("❌ Failed to load ticket", err);
        setErrors({ submit: "Failed to load ticket" });
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      // Convert departmentId → NAME
      const selectedDept = departments.find((d) => d._id === form.departmentId);

      if (!selectedDept) {
        setErrors({ departmentId: "Invalid department" });
        setIsSubmitting(false);
        return;
      }

      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        department: selectedDept.name,
        priority: form.priority,
      };

      console.log("📤 Updating ticket:", payload);

      await updateTicket(id, payload);

      navigate(`/tickets/${id}`);
    } catch (err) {
      console.error("❌ Ticket update failed", err);
      setErrors({
        submit: err.response?.data?.message || "Failed to update ticket",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="p-5">Loading ticket…</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Edit Ticket</h1>

      <TicketForm
        form={form}
        errors={errors}
        handleChange={handleChange}
        handleSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}
