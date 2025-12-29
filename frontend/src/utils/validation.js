// src/utils/validation.js
export function validateTicket(form) {
  const errors = {};
  if (!form.title?.trim()) errors.title = "Title is required";
  if (!form.description?.trim()) errors.description = "Description is required";
  if (!form.priority) errors.priority = "Priority is required";
  if (!form.departmentId) errors.departmentId = "Department is required";
  return { valid: Object.keys(errors).length === 0, errors };
}
