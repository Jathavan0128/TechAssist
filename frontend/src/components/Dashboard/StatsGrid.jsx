import React from "react";
import StatsCard from "./StatsCard";
import { FiUsers, FiBriefcase, FiAlertTriangle, FiCheckCircle } from "react-icons/fi";

export default function StatsGrid({ stats }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatsCard
        title="All Tickets"
        value={stats.total}
        icon={<FiBriefcase className="w-6 h-6" />}
        color="blue"
      />

      <StatsCard
        title="Open"
        value={stats.open}
        icon={<FiAlertTriangle className="w-6 h-6" />}
        color="yellow"
      />

      <StatsCard
        title="Closed"
        value={stats.closed}
        icon={<FiCheckCircle className="w-6 h-6" />}
        color="green"
      />

      <StatsCard
        title="Users"
        value={stats.users}
        icon={<FiUsers className="w-6 h-6" />}
        color="purple"
      />
    </div>
  );
}
