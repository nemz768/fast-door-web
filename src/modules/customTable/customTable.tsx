

import { tableStore } from "@/stores/tableStore";
import { useEffect, useState } from "react";
import "./customTable.scss";
import TablePagination from "../tablePagination/tablePagination";
import DoorsTable from "./doorsTable";
import { formatDate } from "../formatDate/formatDate";
import { useRouter } from 'next/navigation'
import { observer } from "mobx-react-lite";
import removeW from '@/assets/images/removeW.png'
import confirmW from '@/assets/images/confirmW.png'
import editW from '@/assets/images/editW.png'
import TableButton from "../tableButton/tableButton";

interface CustomTableProps {
    role: string;
    pagination?: boolean;
    initialPage?: number;
    initialSize?: number;
    selectedTable?: "mainInstallerTable" | "installerTable" | "allOrdersTable" | "doorsTable";

}


export default observer(function CustomTable({ role, pagination, initialPage, initialSize, selectedTable }: CustomTableProps) {
    const { getUsersData, error, deleteOrder } = tableStore;
    const [page, setPage] = useState<number>(typeof initialPage === 'number' ? Math.max(0, initialPage - 1) : 0);
    const [size, setSize] = useState<number>(initialSize ?? 10);
    const router = useRouter();

    console.log("CustomTable rendered", { role, selectedTable, page, size });

    useEffect(() => {
        getUsersData(role, page, size, selectedTable);
    }, [role, page, size, selectedTable]);

    function decideColumns(role: string) {
        if (role === "administrator") {
            return <th>Филиалы</th>;
        } else {
            return <th className="table-btns">Действие</th>;
        }
    }

    const users = tableStore.data ?? [];

    function neccessaryTables() {
        if (selectedTable === 'installerTable') {
            return (
                <table className="custom-table">
                    <thead className="custom-table-header">
                        <tr className="custom-table-header-box">
                            <th>ФИО</th>
                            <th>Номер телефона</th>
                            <th>Действие</th>
                        </tr>
                    </thead>
                    <tbody className="custom-table-tbody">
                        {users.map((item: any) => (
                            <tr key={item.id}>
                                <td>{item.fullName}</td>
                                <td>{item.phone}</td>
                                <td className="custom-table-tbody-centered">
                                    <TableButton src={editW.src} alt="edit" />
                                    <TableButton src={removeW.src} alt="remove"/>
                                </td>
                            </tr>
                        ))}

                    </tbody>
                </table>
            )
        }
        else if (selectedTable === 'doorsTable') {
            return <DoorsTable
                initialPage={page}
                initialSize={size}
                sortBy="id"
                pagination={pagination ?? false}
            />
        }
        else if (selectedTable === 'allOrdersTable') {
            return (
                <table className="custom-table">
                    <thead className="custom-table-header">
                        <tr className="custom-table-header-box">
                            <th className="table-fullName">ФИО</th>
                            <th className="table-address">Адрес доставки</th>
                            <th>Номер</th>
                            <th>Дата установки</th>
                            <th>Кол-во входных дверей</th>
                            <th>Кол-во межкомнатых дверей</th>
                            <th className="table-comment">Комментарий продавца</th>
                            <th className="table-comment">Ваш комментарий</th>
                            <th>Установщик</th>
                            <th>Филиал</th>
                            <th className="table-btns">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="custom-table-tbody">

                        {users.map((item: any) => (
                            <tr key={item.id}>
                                <td className="table-fullName">{item.fullName || "-"}</td>
                                <td className="table-address">{item.address || "-"}</td>
                                <td className="custom-table-tbody-centered">{item.phone || "-"}</td>
                                <td className="custom-table-tbody-centered">{formatDate(item.dateOrder)}</td>
                                <td className="custom-table-tbody-centered">{item.frontDoorQuantity || "-"}</td>
                                <td className="custom-table-tbody-centered">{item.inDoorQuantity || "-"}</td>
                                <td className="table-comment">{item.messageSeller || "-"}</td>
                                <td className="table-comment">{item.messageMainInstaller || "-"}</td>
                                <td className="custom-table-tbody-centered">{item.installerName || "-"}</td>
                                <td>{item.nickname || "-"}</td>
                                <td className="table-btns custom-table-tbody-centered">
                                    <TableButton src={editW.src} alt="edit" />
                                    <TableButton src={removeW.src} alt="remove" onClick={() => {
                                       deleteOrder(item.id)
                                        getUsersData(role, page, size, selectedTable);
                                    }} />
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )
        } else {
            return (
                <table className="custom-table">
                    <thead className="custom-table-header">
                        <tr className="custom-table-header-box">
                            {role === 'main' && <th>Филиал</th>}
                            {(role === 'administrator' || role === 'salespeople') && <th className="table-fullName">ФИО</th>}
                            <th className="table-address">Адрес доставки</th>
                            <th>Номер</th>
                            <th>Дата <br /> установки</th>
                            <th>Кол-во <br /> входных <br /> дверей</th>
                            <th>Кол-во <br /> межкомнатых <br /> дверей</th>
                            {role === 'main' && <th className="table-comment">Комментарий продавца</th>}
                            <th className="table-comment">Ваш комментарий</th>
                            <th>Установщик</th>
                            {decideColumns(role)}
                        </tr>
                    </thead>
                    <tbody className="custom-table-tbody">
                        {users.map((item: any) => (
                            <tr key={item.id}>
                                {role === 'main' && <td className="custom-table-tbody-centered">{item.nickname || '-'}</td>}
                                {(role === 'administrator' || role === "salespeople") && <td className="table-fullName">{item.fullName || "-"}</td>}
                                <td className="table-address">{item.address || "-"}</td>
                                <td className="custom-table-tbody-centered">{item.phone || "-"}</td>
                                <td className="custom-table-tbody-centered">{formatDate(item.dateOrder) || "-"}</td>
                                <td className="custom-table-tbody-centered">{item.frontDoorQuantity || "-"}</td>
                                <td className="custom-table-tbody-centered">{item.inDoorQuantity || "-"}</td>
                                <td className="table-comment">{item.messageSeller || "-"}</td>
                                {role === 'main' && <td className="table-comment">{item.messageMainInstaller || "-"}</td>}
                                <td className="custom-table-tbody-centered">{item.installerName || "-"}</td>
                                {role === 'administrator' && <td className="custom-table-tbody-centered">{item.nickname || "-"}</td>}
                                {(role === 'salespeople') && <td className="table-btns custom-table-tbody-centered">
                                    <TableButton src={editW.src} alt="edit" onClick={() => router.push(`./edit/${item.id}`)} />
                                    <TableButton src={removeW.src} alt="remove" onClick={() => {
                                        deleteOrder(item.id)
                                        getUsersData(role, page, size, selectedTable);
                                    }} /></td>}
                                {(role === 'main') && <td className="custom-table-tbody-centered"><TableButton src={confirmW.src} alt="confirm" /></td>}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )
        }
    }


    if (!tableStore.isInitialized) {
        return null;
    }

    if (error) return <div style={{ color: 'red' }}>Ошибка: {error}</div>;

    return (
        <>
            <div className="custom-table-wrapper">
                {users.length > 0 ? neccessaryTables() : (
                    <div>
                        <p>Заказов пока нет</p>
                    </div>
                )}
            </div>

            {pagination && users.length > 0 && (
                <TablePagination
                    page={page}
                    totalPages={
                        tableStore.getTotalPages()
                    }
                    onPrev={() => setPage((p) => Math.max(0, p - 1))}
                    onNext={() => setPage((p) => p + 1)}
                    onSetPage={(p) => setPage(p)}
                    size={size}
                    showSizeSelect={true}
                    onSizeChange={(s) => { setSize(s); setPage(0); }}
                />
            )}
        </>
    );
})