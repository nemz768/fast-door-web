'use client'

import CustomTable from "@/modules/customTable/customTable";
import Footer from "@/modules/footer/footer";
import Header from "@/modules/header/header";
import ProtectedRoute from "@/modules/security/protectedRoute";
import './orders.scss'
import Title from "@/modules/title/title";


export default function OrdersMainInstaller () {

    
    const links = [
        { id: 1, name: "Главная", href: "../mainInstaller" },
        { id: 2, name: "Список установщиков", href: "InstallersList" },
    ]

        return (
            <ProtectedRoute allowedRoles={["main"]}>
                    <Header links={links}/>
                <main className="orders_main">
                    <Title centered={true} pageTitle={"Список заказов"} />
                    <CustomTable role={"main"}   
                    selectedTable="allOrdersTable"
                       pagination={true}
                    initialPage={0}
                    initialSize={6}                 
                    />
                </main>
                <Footer/>
            </ProtectedRoute>
        )
}