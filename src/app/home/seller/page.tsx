'use client'

import Button from "@/modules/button/button";
import Footer from "@/modules/footer/footer";
import Header from "@/modules/header/header";
import ProtectedRoute from "@/modules/security/protectedRoute";
import './seller.scss'
import { useRouter } from "next/navigation";

export default function SellerPage() {

    const router = useRouter();
    const links = [
        {id: 1,  name: "Список заказов", href: "./seller/listOrdersSeller"},
        {id: 2,  name: "Создать заказ", href: "./seller/create"},
    ]

    return (
   <ProtectedRoute allowedRoles={['salespeople']}>
        <div className="seller-page">
 <Header links={links} />
        <main className="seller_main">
                <div className="seller-block">
                    <h3 className="seller-block-title">Действия</h3>
                    <div className="seller-block-btns">
                       <Button
                        text="Создать заказ"
                        onClick={()=> router.push("./seller/create")}
                        className="seller-block-btns-btn"
                       />
                       <Button
                         text="Список заказов"
                          onClick={()=> router.push("./seller/listOrdersSeller")}
                         className="seller-block-btns-btn"
                       />
                    </div>
                </div>
        </main>
        <Footer />
        </div>
    </ProtectedRoute>
    );
}