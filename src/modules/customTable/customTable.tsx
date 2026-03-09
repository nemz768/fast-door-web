

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
import InstallerChoiceSelect from '../installerChoice/installerChoice';
import { installerStore } from "@/stores/installerStore";
import CommentInput from "../installerCommentInput/installerCommentInput";
import Loader from "../loader/loader";

interface CustomTableProps {
    role: string;
    pagination?: boolean;
    initialPage?: number;
    initialSize?: number;
    selectedTable?: "mainInstallerTable" | "installerTable" | "allOrdersTable" | "doorsTable";

}

export default observer(function CustomTable({ role, pagination, initialPage, initialSize, selectedTable }: CustomTableProps) {
    const { getUsersData, error, deleteOrder, loading } = tableStore;
    const [page, setPage] = useState<number>(typeof initialPage === 'number' ? Math.max(0, initialPage - 1) : 0);
    const [size, setSize] = useState<number>(initialSize ?? 10);
    const router = useRouter();
    const [selectedComments, setSelectedComments] = useState<Record<number, string>>({});
    const [selectedInstallers, setSelectedInstallers] = useState<Record<number, string>>({});
    console.log("CustomTable rendered", { role, selectedTable, page, size });
    const [editingRowId, setEditingRowId] = useState<number | null>(null);

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

    if (loading) {
        return (
            <div className="custom-table-wrapper">
                <Loader spinType={false} />
            </div>
        );
    }

    const handleChangeInstaller = (itemId: number, installerFullName: string) => {
        setSelectedInstallers(prev => ({
            ...prev,
            [itemId]: installerFullName
        }));
    };

    const handleSubmitInstaller = async (item: any) => {
        const installerFullName = selectedInstallers[item.id];

        if (!installerFullName) {
            alert("Выберите установщика!");
            return;
        }

        try {
            await tableStore.postInstallerOrder(
                item.id,
                installerFullName,
                item.frontDoorQuantity,
                item.inDoorQuantity,
                selectedComments[item.id] || ""
            );

            await installerStore.getInstallersWorkloadByDate(item.dateOrder);


            tableStore.data = tableStore.data.filter(
                (order: any) => order.id !== item.id
            );

        } catch (err) {
            console.error("Ошибка при выборе установщика:", err);
            alert("Не удалось выбрать установщика");
        }
    };

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
                                    <TableButton onClick={() => router.push(`./edit/${item.id}`)} src={editW.src} alt="edit" />
                                    <TableButton src={removeW.src} alt="remove" onClick={async () => {
                                        await installerStore.deleteInstaller(item.id);
                                        getUsersData(role, page, size, selectedTable);
                                    }} />
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
                            <th className="table-count">Кол-во вх. дверей</th>
                            <th className="table-count">Кол-во межкомн. дверей</th>
                            <th className="table-comment">Комментарий продавца</th>
                            <th className="table-comment">Ваш комментарий</th>
                            <th className="table-installer">Установщик</th>
                            <th>Филиал</th>
                            <th className="table-btns">Действия</th>
                        </tr>
                    </thead>
                    <tbody className="custom-table-tbody">

                        {users.map((item: any) => {
                            const isEditing = editingRowId === item.id;

                            return (<tr key={item.id}>
                                <td className="table-fullName">{item.fullName || "-"}</td>
                                <td className="table-address">{item.address || "-"}</td>
                                <td className="custom-table-tbody-centered">{item.phone || "-"}</td>
                                <td className="custom-table-tbody-centered">{formatDate(item.dateOrder)}</td>
                                <td className="custom-table-tbody-centered table-count">{item.frontDoorQuantity || "-"}</td>
                                <td className="custom-table-tbody-centered table-count">{item.inDoorQuantity || "-"}</td>
                                <td className="table-comment">{item.messageSeller || "-"}</td>
                                <td className="table-comment">
                                    {isEditing ? (
                                        <CommentInput
                                            value={selectedComments[item.id] || item.messageMainInstaller || ""}
                                            onChange={(val) =>
                                                setSelectedComments(prev => ({
                                                    ...prev,
                                                    [item.id]: val
                                                }))
                                            }
                                        />
                                    ) : (
                                        item.messageMainInstaller || "-"
                                    )}
                                </td>
                                <td className="custom-table-tbody-centered table-installer">
                                    {isEditing ? (
                                        <InstallerChoiceSelect
                                            date={item.dateOrder}
                                            selectedInstaller={selectedInstallers[item.id]}
                                            onChange={(installerFullName) =>
                                                handleChangeInstaller(item.id, installerFullName)
                                            }
                                        />
                                    ) : (
                                        item.installerName || "-"
                                    )}
                                </td>
                                <td>{item.nickname || "-"}</td>
                                <td className="table-btns custom-table-tbody-centered">
                                    {isEditing ? (
                                        <TableButton
                                            src={confirmW.src}
                                            alt="confirm"
                                            onClick={async () => {
                                                await handleSubmitInstaller(item);
                                                setEditingRowId(null);
                                                getUsersData(role, page, size, selectedTable);
                                            }}
                                        />
                                    ) : (
                                        <TableButton
                                            src={editW.src}
                                            alt="edit"
                                            onClick={() => setEditingRowId(item.id)}
                                        />
                                    )}

                                    <TableButton
                                        src={removeW.src}
                                        alt="remove"
                                        onClick={() => {
                                            deleteOrder(item.id);
                                            getUsersData(role, page, size, selectedTable);
                                        }}
                                    />
                                </td>
                            </tr>
                            );
                        })}
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
                            <th className="table-count">Кол-во <br /> входных <br /> дверей</th>
                            <th className="table-count">Кол-во <br /> межкомн. <br /> дверей</th>
                            {role === 'main' && <th className="table-comment">Комментарий продавца</th>}
                            <th className="table-comment">Ваш комментарий</th>
                            <th className="table-installer">Установщик</th>
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
                                <td className="custom-table-tbody-centered table-count">{item.frontDoorQuantity || "-"}</td>
                                <td className="custom-table-tbody-centered table-count">{item.inDoorQuantity || "-"}</td>
                                <td className="table-comment">{item.messageSeller || "-"}</td>
                                {role === 'main' && (
                                    <td className="table-comment">
                                        <CommentInput
                                            value={selectedComments[item.id] || item.messageMainInstaller || ""}
                                            onChange={(val) =>
                                                setSelectedComments(prev => ({ ...prev, [item.id]: val }))
                                            }
                                        />
                                    </td>
                                )}
                                {(role === 'salespeople' || role === 'administrator') && <td className="custom-table-tbody-centered table-installer">{item.installerName || "-"}</td>}
                                {role === 'administrator' && <td className="custom-table-tbody-centered">{item.nickname || "-"}</td>}
                                {role === 'main' && (
                                    <td className="custom-table-tbody-centered table-installer">
                                        <InstallerChoiceSelect
                                            date={item.dateOrder}
                                            selectedInstaller={selectedInstallers[item.id]}
                                            onChange={(installerFullName) =>
                                                handleChangeInstaller(item.id, installerFullName)
                                            }
                                        />
                                    </td>
                                )}
                                {(role === 'salespeople') && <td className="table-btns custom-table-tbody-centered">
                                    <TableButton src={editW.src} alt="edit" onClick={() => router.push(`./edit/${item.id}`)} />
                                    <TableButton src={removeW.src} alt="remove" onClick={() => {
                                        deleteOrder(item.id)
                                        getUsersData(role, page, size, selectedTable);
                                    }} /></td>}

                                {role === 'main' && (
                                    <td className="custom-table-tbody-centered">
                                        <TableButton
                                            src={confirmW.src}
                                            alt="confirm"
                                            onClick={() => handleSubmitInstaller(item)}
                                        />
                                    </td>
                                )}
                            </tr>
                        ))}
                    </tbody>
                </table>
            )
        }
    }


    return (
        <>
            <div className="custom-table-wrapper">
                {users.length > 0 ? neccessaryTables() : (
                    <div className="emptyOrders-block">
                        {error && error.length > 0 ? (
                            <p style={{ color: 'red' }}>Ошибка - {error}</p>
                        ) : role === 'main' && selectedTable === 'installerTable' ? (
                            <p>Установщиков пока нет</p>
                        ) : (
                            <p>Заказов пока нет</p>
                        )}
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