// utils/emailService.js
import sendEmail from "./sendEmail.js";
import {
  ticketCreatedTemplate,
  ticketAssignedTemplate,
  ticketResolvedTemplate,
  ticketUpdatedTemplate,
} from "./emailTemplates.js";

const enabled = () => process.env.EMAIL_NOTIFICATIONS_ENABLED !== "false";

export const sendTicketCreated = async (ticket, user) => {
  if (!enabled() || !user?.email) return;
  const tpl = ticketCreatedTemplate(ticket, user);
  await sendEmail({ to: user.email, subject: tpl.subject, text: tpl.text, html: tpl.html });
};

export const sendTicketAssigned = async (ticket, assignee, assigner) => {
  if (!enabled() || !assignee?.email) return;
  const tpl = ticketAssignedTemplate(ticket, assignee, assigner);
  await sendEmail({ to: assignee.email, subject: tpl.subject, text: tpl.text, html: tpl.html });
};

export const sendTicketResolved = async (ticket, owner, resolver) => {
  if (!enabled() || !owner?.email) return;
  const tpl = ticketResolvedTemplate(ticket, owner, resolver);
  await sendEmail({ to: owner.email, subject: tpl.subject, text: tpl.text, html: tpl.html });
};

export const sendTicketUpdated = async (ticket, owner, changes) => {
  if (!enabled() || !owner?.email) return;
  const tpl = ticketUpdatedTemplate(ticket, owner, changes);
  await sendEmail({ to: owner.email, subject: tpl.subject, text: tpl.text, html: tpl.html });
};
