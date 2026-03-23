'use client'

import '@/globals.scss';
import Footer from "@/modules/footer/footer";
import Header from "@/modules/header/header";
import Reports from "@/modules/reports/reports";
import ProtectedRoute from "@/modules/security/protectedRoute";
import Title from "@/modules/title/title";
import './reportPage.scss'

export default function Report() {
 

    const links = [
        {id: 1,  name: "К заказам", href: "../owner"},
    ]

    return (
   <ProtectedRoute allowedRoles={['administrator']}>
        <Header links={links} />
        <main className='report_main'>
          <Title pageTitle={'Панель получения отчетности'}/>
                <Reports
                />
        </main>
        <Footer />
    </ProtectedRoute>
    );
}