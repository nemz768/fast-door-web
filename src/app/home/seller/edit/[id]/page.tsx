'use client'

import HeaderCreation from "@/modules/headerCreation/headerCreation";
import Title from "@/modules/title/title";

import { observer } from "mobx-react-lite";

import ProtectedRoute from "@/modules/security/protectedRoute";
import '../../create/sellerCreate.scss'
import { SellerForm } from "@/modules/sellerForm/sellerForm";
import { useParams } from "next/navigation";


const CreateOrderForm = observer(() => {

    const params = useParams();
    
    return (
        <ProtectedRoute allowedRoles={['salespeople']}>
            <HeaderCreation />
            <div className="create-form-wrapper">
                <Title centered={true} pageTitle={"Редактирование заказа"} />
               <SellerForm id={Array.isArray(params.id) ? params.id[0] : params.id} type="edit"/>
            </div>
        </ProtectedRoute>
    )
})

export default CreateOrderForm;
