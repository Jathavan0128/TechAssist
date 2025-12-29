// utils/emailTemplates.js

const getDeptName = (ticket) => {
  if (!ticket) return "Unknown";
  if (ticket.department?.name) return ticket.department.name;
  if (typeof ticket.department === "string") return ticket.department;
  return "Unknown";
};

export const ticketCreatedTemplate = (ticket, user) => {
  const dept = getDeptName(ticket);
  const subject = `New Ticket Created: ${ticket.title}`;
  const text = `Hi ${user.name},

A new ticket has been created.

Ticket ID: ${ticket._id}
Title: ${ticket.title}
Status: ${ticket.status}
Priority: ${ticket.priority}
Department: ${dept}

You can view the ticket in the dashboard.
`;
  const html = `
    <h2>New Ticket Created</h2>
    <p><strong>Ticket ID:</strong> ${ticket._id}</p>
    <p><strong>Title:</strong> ${ticket.title}</p>
    <p><strong>Status:</strong> ${ticket.status}</p>
    <p><strong>Priority:</strong> ${ticket.priority}</p>
    <p><strong>Department:</strong> ${dept}</p>
    <p><strong>Created by:</strong> ${user.name} (${user.email})</p>
  `;
  return { subject, text, html };
};

export const ticketAssignedTemplate = (ticket, assignee, assigner) => {
  const dept = getDeptName(ticket);
  const subject = `Ticket Assigned to You: ${ticket.title}`;
  const text = `Hi ${assignee.name},

You have been assigned a ticket.

Ticket ID: ${ticket._id}
Title: ${ticket.title}
Department: ${dept}
Assigned by: ${assigner?.name || "System"}
`;
  const html = `
    <h2>Ticket Assigned</h2>
    <p><strong>Ticket ID:</strong> ${ticket._id}</p>
    <p><strong>Title:</strong> ${ticket.title}</p>
    <p><strong>Department:</strong> ${dept}</p>
    <p><strong>Assigned by:</strong> ${assigner?.name || "System"}</p>
  `;
  return { subject, text, html };
};

export const ticketResolvedTemplate = (ticket, user, resolver) => {
  const dept = getDeptName(ticket);
  const resolution = ticket.resolution?.trim() || "—";
  const subject = `Ticket Resolved: ${ticket.title}`;
  const text = `Hi ${user.name},

Your ticket "${ticket.title}" has been marked as Resolved.

Ticket ID: ${ticket._id}
Department: ${dept}
Resolved by: ${resolver?.name || "Staff"}
Resolution notes: ${resolution}
`;
  const html = `
    <h2>Ticket Resolved</h2>
    <p><strong>Ticket ID:</strong> ${ticket._id}</p>
    <p><strong>Title:</strong> ${ticket.title}</p>
    <p><strong>Department:</strong> ${dept}</p>
    <p><strong>Resolved by:</strong> ${resolver?.name || "Staff"}</p>
    <p><strong>Resolution notes:</strong> ${resolution}</p>
  `;
  return { subject, text, html };
};

export const ticketUpdatedTemplate = (ticket, user, changes) => {
  const dept = getDeptName(ticket);
  const subject = `Ticket Updated: ${ticket.title}`;
  const text = `Hi ${user.name},

Your ticket "${ticket.title}" has been updated.

Ticket ID: ${ticket._id}
Department: ${dept}
Changes: ${changes || "Updated"}
`;
  const html = `
    <h2>Ticket Updated</h2>
    <p><strong>Ticket ID:</strong> ${ticket._id}</p>
    <p><strong>Title:</strong> ${ticket.title}</p>
    <p><strong>Department:</strong> ${dept}</p>
    <p><strong>Changes:</strong> ${changes || "Updated"}</p>
  `;
  return { subject, text, html };
};
