'use client'

import HeaderCreation from "@/modules/headerCreation/headerCreation";
import Title from "@/modules/title/title";
import './sellerCreate.scss'
import { observer } from "mobx-react-lite";

import ProtectedRoute from "@/modules/security/protectedRoute";

import { SellerForm } from "@/modules/sellerForm/sellerForm";


const CreateOrderForm = observer(() => {
    return (
        <ProtectedRoute allowedRoles={['salespeople']}>
                <HeaderCreation />
                <div className="create-form-wrapper">
                    <Title centered={true} pageTitle={"Создание нового заказа"} />
                    <SellerForm />
            </div>
        </ProtectedRoute>
    )
})

export default CreateOrderForm;
