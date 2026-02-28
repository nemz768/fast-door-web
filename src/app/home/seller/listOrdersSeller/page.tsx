'use client'

import CustomTable from "@/modules/customTable/customTable";
import Footer from "@/modules/footer/footer";
import Header from "@/modules/header/header";
import ProtectedRoute from "@/modules/security/protectedRoute";
import Title from "@/modules/title/title";
import './listOrdersSeller.scss'

export default function ListOrdersSeller() {

    const links = [
        {id: 1,  name: "Создать заказ", href: "./create"},
    ]

    return (
   <ProtectedRoute allowedRoles={['salespeople']}>
      <div>
        <Header links={links} />
        <main className="ordersSeller_main">
          <Title pageTitle={"Панель продавца"}/>
                  <CustomTable 
                             role="salespeople" 
                             pagination={true}
                             initialPage={0}
                             initialSize={7}
                         />
        </main>
        <Footer />      
      </div>
    </ProtectedRoute>
    );
}