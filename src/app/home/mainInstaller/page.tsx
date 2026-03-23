'use client'

import CustomTable from "@/modules/customTable/customTable";
import Footer from "@/modules/footer/footer";
import Header from "@/modules/header/header";
import ProtectedRoute from "@/modules/security/protectedRoute";
import Title from "@/modules/title/title";
import './mainInstaller.scss'
import DoorsTable from "@/modules/customTable/doorsTable";
import UniversalCalendar from "@/modules/customCalendar/customCalendar";
import { calendarStore } from "@/stores/calendarStore";

export default function MainInstaller() {
    const links = [
        { id: 1, name: "Список установщиков", href: "./mainInstaller/InstallersList" },
        { id: 2, name: "Добавить установщика", href: "./mainInstaller/create" },
        { id: 3, name: "Полный список заказов", href: "./mainInstaller/listOrdersMainInstaller" },
    ]

    return (
        <ProtectedRoute allowedRoles={['main']}>
            <Header links={links} />
            <main className="mainInstaller_main">
                <Title centered={true} pageTitle={"Панель главного установщика"} />
                <CustomTable
                    role="main"
                    pagination={true}
                    initialPage={0}
                    initialSize={6}
                    selectedTable="mainInstallerTable"
                />
                <div className="main-content-blocks">
                    <UniversalCalendar
                        fetchData={async () => {
                            await calendarStore.fetchAll();
                            return calendarStore.allData;
                        }}
                        showClosedDates={false}
                        multiSelect={true}
                        showActions={true}
                        tileContentFn={(date, item) => {
                            if (!item) return null;

                         
                            const isClosed = !item.available;
                            const color = isClosed ? '#fff' : '#8b7355';

                            return (
                                <p key={item.id} className="calendar-tile-content" style={{ color }}>
                                    В: {item.frontDoorQuantity} <br /> М: {item.inDoorQuantity}
                                </p>
                            );
                        }}
                    />

                    <DoorsTable
                        pagination={true}
                        initialSize={8}
                    />
                </div>

            </main>
            <Footer />
        </ProtectedRoute>
    );
}