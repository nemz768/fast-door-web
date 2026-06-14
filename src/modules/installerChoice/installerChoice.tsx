import { observer } from "mobx-react-lite";
import { useEffect } from "react";
import { installerStore } from "@/stores/installerStore";
import "./InstallerChoiceSelect.scss";
import '@/modules/customTable/customTable.scss';

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
      <option value="">Выбрать</option>
      {installerStore.installers.map(installer => {
        const w = workload[installer.full_name];
        return (
          <option key={installer.id} value={installer.full_name}>
            {installer.full_name} {w ? `M: ${w.front} В: ${w.in}` : ""}
          </option>
        );
      })}
    </select>
  );
});

export default InstallerChoiceSelect;