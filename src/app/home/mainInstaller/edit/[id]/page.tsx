'use client'

import HeaderCreation from "@/modules/headerCreation/headerCreation";
import InstallerForm from "@/modules/installerForm/installerForm";
import ProtectedRoute from "@/modules/security/protectedRoute";
import Title from "@/modules/title/title";
import '../../create/creationInstaller.scss'
import { useParams } from "next/navigation";
import { observer } from "mobx-react-lite";



const InstallersCreate  = observer(() => {

    const params = useParams();

        return (
            <ProtectedRoute allowedRoles={["main"]}>
                    <HeaderCreation route="../InstallersList"/>
                <main className="create-main">
                 <Title pageTitle={"Изменить данные установщика"} />
                 <InstallerForm flag="edit" id={Number(params.id)} />
                </main>
            </ProtectedRoute>
        )
})


export default InstallersCreate;
