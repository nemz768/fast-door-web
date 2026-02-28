import { observer } from "mobx-react-lite";
import { formatDate } from "../formatDate/formatDate";
import { reportsStore } from "@/stores/reportsStore";
import './reports.scss'

interface Report {
    id: number;
    title: string;
    dateFrom: string;
    dateTo: string;
}

interface ReportListProps {
    reports: Report[];
}

export default observer(function ReportList({ reports }: ReportListProps) {
    const { getReportDownload } = reportsStore;

    return (
        <div className="reports-block-box reports-block-box--scrollable">
            {reports && reports.length > 0 ? (
                <>
                    <h2 className="reports-block-box-title">Список созданых отчетов</h2>
                    {reports.map((item) => (
                        <div key={item.id} className="reports-block-box-rep">
                            <p className="reports-block-box-rep-ptext">
                                <span className="reports-block-box-rep-ptext-userTitle">{item.title}</span>
                                <span className="reports-block-box-rep-ptext-date-group">
                                    <span className="reports-block-box-rep-ptext-date">
                                        {formatDate(item.dateFrom)} – {formatDate(item.dateTo)}
                                    </span>
                                    <button 
                                        onClick={() => getReportDownload(item.id, item.title)} 
                                        className="reports-block-box-rep-download"
                                    >
                                        D
                                    </button>
                                </span>
                            </p>
                        </div>
                    ))}
                </>
            ) : (
                <h2 className="reports-block-box-title">Список отчетов пуст</h2>
            )}
        </div>
    );
});