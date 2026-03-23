'use client'

import HeaderCreation from "@/modules/headerCreation/headerCreation";
import InstallerForm from "@/modules/installerForm/installerForm";
import ProtectedRoute from "@/modules/security/protectedRoute";
import Title from "@/modules/title/title";
import './creationInstaller.scss'
import { observer } from "mobx-react-lite";


const InstallersCreate  = observer(() => {


        return (
            <ProtectedRoute allowedRoles={["main"]}>
                 <HeaderCreation/>
                <main className="create-main">
                <Title pageTitle={"Добавить установщика"} />
                <InstallerForm flag="create" />
                </main>
            </ProtectedRoute>
        )
})

export default InstallersCreate;