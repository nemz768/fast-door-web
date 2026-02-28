'use client'

import ProtectedRoute from "@/modules/security/protectedRoute";



export default function InstallersCreate () {


        return (
            <ProtectedRoute allowedRoles={["main"]}>
                <main>
                
                </main>
            </ProtectedRoute>
        )
}