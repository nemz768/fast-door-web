'use client'

import CustomTable from "@/modules/customTable/customTable";
import Footer from "@/modules/footer/footer";
import Header from "@/modules/header/header";
import ProtectedRoute from "@/modules/security/protectedRoute";
import './installers.scss'
import Title from "@/modules/title/title";


export default function InstallersList() {


    const links = [
        { id: 1, name: "Главная", href: "../mainInstaller" },
        { id: 2, name: "Добавить установщика", href: "./create" },
        { id: 3, name: "Полный список заказов", href: "listOrdersMainInstaller" },
    ]

    return (
        <ProtectedRoute allowedRoles={["main"]}>
            <Header links={links} />
             <main className="installers_main">
                    <Title centered={true} pageTitle={"Список установщиков"} />
            <div className="table-wrapper-installer">
               
                    <CustomTable role={"main"}
                        selectedTable="installerTable"
                    />
                
            </div>
            </main>

            <Footer />
        </ProtectedRoute>
    )
}