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
  const getTomorrow = () => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(0, 0, 0, 0);
    return d;
  };

  const isFuture = (dateStr: string) => {
    const tomorrow = getTomorrow();
    return new Date(dateStr) >= tomorrow;
  };

  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const loadFilteredData = async () => {
      let result: any[] = [];
      let currentPage = page;

      while (result.length < size) {
        await calendarStore.fetchPaged(currentPage, size, sortBy);

        const filtered = calendarStore.pagedData.filter(item =>
          isFuture(item.date)
        );

        result = [...result, ...filtered];

        if (currentPage >= calendarStore.totalPages - 1) break;

        currentPage++;
      }

      setData(result.slice(0, size));
    };

    if (pagination) {
      loadFilteredData();
    } else {
      calendarStore.fetchAll().then(() => {
        const filtered = calendarStore.allData.filter(item =>
          isFuture(item.date)
        );
        setData(filtered);
      });
    }
  }, [page, size, sortBy, pagination]);

  return (
    <div className="doorsTable-container">
      <table className="custom-table doorsTable">
        <thead className="custom-table-header">
          <tr className="custom-table-header-box">
            <th className="custom-table-header-date">Дата</th>
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
                <tr className="custom-table-tbody" key={item.date}>
                  <td className="custom-table-tbody-centered custom-table-header-date">{formatDate(item.date)}</td>
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