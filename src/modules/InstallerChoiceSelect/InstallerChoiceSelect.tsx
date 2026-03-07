import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { installerStore } from "@/stores/installerStore";

interface InstallerChoiceSelectProps {
  date: string;
  selectedInstaller?: string;
  onChange: (installerFullName: string) => void;
}

const InstallerChoiceSelect = observer(({ date, selectedInstaller, onChange }: InstallerChoiceSelectProps) => {
  useEffect(() => {
    installerStore.getInstallers();
    installerStore.getInstallersWorkloadByDate(date);
  }, [date]);

  const workload = installerStore.workloadByDate[date] || {};

  return (
    <select
      value={selectedInstaller || ""}
      onChange={(e) => onChange(e.target.value)}
      name="installer"
    >
      <option value="">Выберите установщика</option>
      {installerStore.installers.map(installer => {
        const w = workload[installer.fullName];
        return (
          <option key={installer.id} value={installer.fullName}>
            {installer.fullName} {w ? `M: ${w.front} Ж: ${w.in}` : ""}
          </option>
        );
      })}
    </select>
  );
});

export default InstallerChoiceSelect;