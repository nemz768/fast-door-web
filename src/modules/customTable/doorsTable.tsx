import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import { calendarStore } from "@/stores/calendarStore";
import TablePagination from "../tablePagination/tablePagination";
import { formatDate } from "../formatDate/formatDate";

interface DoorsTableProps {
  initialPage?: number;
  initialSize?: number;
  sortBy?: string;
  pagination: boolean;
}

const DoorsTable = observer(function DoorsTable({
  initialPage,
  initialSize,
  sortBy,
  pagination,
}: DoorsTableProps) {
  const [page, setPage] = useState(
    typeof initialPage === "number" ? Math.max(0, initialPage - 1) : 0
  );
  const [size, setSize] = useState(initialSize ?? 10);

  useEffect(() => {
    const loadData = async () => {
      if (pagination) {
        await calendarStore.fetchPaged(page, size, sortBy);

        if (calendarStore.pagedData.length === 0 && page > 0) {
          const lastPage = Math.max(0, Math.ceil(calendarStore.totalElements / size) - 1);
          setPage(lastPage);
        }
      } else {
        await calendarStore.fetchAll();
      }
    };

    loadData();
  }, [page, size, sortBy, pagination]);

  const data = pagination ? calendarStore.pagedData : calendarStore.allData;

  return (
    <div className="doorsTable-container">
      <table className="custom-table doorsTable">
        <thead className="custom-table-header">
          <tr className="custom-table-header-box">
            <th>Дата</th>
            <th>Кол-во входных дверей</th>
            <th>Кол-во межкомнатных дверей</th>
          </tr>
        </thead>
        <tbody className="custom-table-tbody">
          {data.length === 0 && (
            <tr>
              <td colSpan={3} style={{ textAlign: "center" }}>
                Двери отсутствуют
              </td>
            </tr>
          )}

          {data
            .map((item) => (
              item.available ? (
                <tr key={item.date}>
                  <td className="custom-table-tbody-centered">{formatDate(item.date)}</td>
                  <td className="custom-table-tbody-centered">{item.frontDoorQuantity}</td>
                  <td className="custom-table-tbody-centered">{item.inDoorQuantity}</td>
                </tr>
              ) :
                (
                  <tr key={item.date}>
                    <td>{formatDate(item.date)}</td>
                    <td className="custom-table-tbody-centered" colSpan={2}>Дата закрыта</td>
                  </tr>
                )
            ))}
        </tbody>
      </table>

      {pagination && data.length > 0 && (
        <TablePagination
          page={page}
          totalPages={calendarStore.totalPages}
          onPrev={() => setPage((p) => Math.max(0, p - 1))}
          onNext={() => setPage((p) => p + 1)}
          onSetPage={(p) => setPage(p)}
          size={size}
          showSizeSelect={true}
          onSizeChange={(s) => {
            setSize(s);
            setPage(0);
          }}
        />
      )}
    </div>
  );
});

export default DoorsTable;