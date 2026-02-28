'use client'

import CustomTable from "@/modules/customTable/customTable";
import Footer from "@/modules/footer/footer";
import Header from "@/modules/header/header";
import ProtectedRoute from "@/modules/security/protectedRoute";
import "./owner.scss";
import Title from "@/modules/title/title";

export default function AdminPage() {

    const links = [
        {id: 1,  name: "Панель отчетности", href: "./owner/report"},
    ]

    return (
   <ProtectedRoute allowedRoles={['administrator']}>
        <Header links={links} />
        <main className="owner_main">
          <Title pageTitle={'Панель администратора'}/>
                    <CustomTable 
                    role="administrator" 
                    pagination={true}
                    initialPage={0}
                    initialSize={6}
                  
                />
        </main>
        <Footer />
    </ProtectedRoute>
    );
}