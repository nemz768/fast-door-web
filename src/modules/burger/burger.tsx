import { useState } from "react"

export default function Burger () {

    const [isActive, setIsActive] = useState<boolean>(false)


    const getModalWindow = () => {
        setIsActive(true)
        return (
            <div className="modal">
                <h4>modal</h4>
            </div>
        )
    }

    return (
        <>
        
        </>
    )
}