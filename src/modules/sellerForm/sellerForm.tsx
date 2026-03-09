import { orderStore } from "@/stores/orderStore";

import { useRouter } from "next/navigation";
import Button from "../button/button";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";
import Input from "../input/input";
import MaskedInput from "../inputMask/MaskedInput";


interface SellerProps {
    id?: number;
    type?: 'create' | 'edit';
}

export const SellerForm = observer(({ id, type = 'create' }: SellerProps) => {

    const router = useRouter();
    const [orderData, setOrderData] = useState({
        fullName: "",
        address: "",
        phone: "",
        messageSeller: "",
        dateOrder: "",
        frontDoorQuantity: 0,
        inDoorQuantity: 0,
    });

    useEffect(() => {
        if (type === "edit" && id) {
            const fetchData = async () => {
                try {
                    orderStore.errors = {};
                    const response = await orderStore.getOrderSeller(id, "salespeople");
                    const item = response?.orderAttribute;

                    if (item) {
                        const formattedData = {
                            fullName: item.fullName || "",
                            address: item.address || "",
                            phone: item.phone || "",
                            messageSeller: item.messageSeller || "",
                            dateOrder: item.dateOrder || "",
                            frontDoorQuantity: item.frontDoorQuantity || 0,
                            inDoorQuantity: item.inDoorQuantity || 0,
                        };

                        setOrderData(formattedData);

                        Object.entries(formattedData).forEach(([key, value]) => {
                            orderStore.setField(key as keyof typeof formattedData, value);
                        });
                    }

                } catch (err) {
                    console.error('ошибка при загрузке данных:', err);
                }
            };
            fetchData();
        }
    }, [id, type]);

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();

                if (orderStore.validateForm()) {
                    let result;

                    if (type === 'edit' && id) {
                        result = await orderStore.editOrderSeller(id, orderData)
                    } else {
                        result = await orderStore.postOrderData({ ...orderStore.payload });
                    }

                    if (result) {
                        type === 'edit' ? router.push('../listOrdersSeller') : router.push('./');
                    } else {
                        alert(`Ошибка: ${orderStore.error}`);
                    }
                }
            }}
            className="create-form"
        >
            <h2 className="create-form-subtitle">Укажите данные заказчика</h2>
            <div className="create-form-block">
                <div className="create-form-block-subblock">
                    <label className="form-label">
                        ФИО:
                        <Input
                            name="fullName"
                            maxLength={50}
                            type="text"
                            placeholder="Введите ФИО"
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setOrderData({ ...orderData, fullName: newValue });
                                orderStore.setField("fullName", newValue);
                            }}
                            value={orderData.fullName}
                            error={orderStore.errors.fullName}
                        />
                    </label>
                    <label className="form-label">
                        Адрес:
                        <Input
                            name="address"
                            type="text"
                            maxLength={100}
                            placeholder="Введите адрес"
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setOrderData({ ...orderData, address: newValue });
                                orderStore.setField("address", newValue);
                            }}
                            value={orderData.address}
                            error={orderStore.errors.address}
                        />
                    </label>
                </div>
                <div className="create-form-block-subblock">
                    <label>
                        Номер телефона:
                        <MaskedInput
                            placeholder="+7 (___) ___-__-__"
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setOrderData({ ...orderData, phone: newValue });
                                orderStore.setField("phone", newValue);
                            }}
                            value={orderData.phone}
                            error={orderStore.errors.phone}
                        />
                    </label>
                    <label>
                        Комментарий:
                        <Input
                            name="messageSeller"
                            type="text"
                            maxLength={150}
                            placeholder="Введите комментарий(необязательно)"
                            value={orderData.messageSeller}
                            error={orderStore.errors.messageSeller}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setOrderData({ ...orderData, messageSeller: newValue });
                                orderStore.setField("messageSeller", newValue);
                            }}
                        />
                    </label>
                </div>
            </div>
            <h2 className="create-form-subtitle">Укажите прочие данные</h2>
            <div className="create-form-block-subblock">
                <label>
                    Дата установки:
                    <Input
                        name="dateOrder"
                        type="date"
                        value={orderData.dateOrder}
                        error={orderStore.errors.dateOrder}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            setOrderData({ ...orderData, dateOrder: newValue });
                            orderStore.setField("dateOrder", newValue);
                        }}
                    />
                </label>
                <label>
                    Кол-во входных дверей:
                    <Input
                        name="frontDoorQuantity"
                        type="number"
                        placeholder="Введите кол-во"
                        min={0}
                        value={orderData.frontDoorQuantity}
                        error={orderStore.errors.frontDoorQuantity}
                        className="number-input input-bottom"
                        onChange={(e) => {
                            const newValue = e.target.value;
                            setOrderData({ ...orderData, frontDoorQuantity: Number(newValue) });
                            orderStore.setField("frontDoorQuantity", newValue);
                        }}
                    />
                </label>
                <label>
                    Кол-во межкомнатных дверей:
                    <Input
                        name="inDoorQuantity"
                        type="number"
                        placeholder="Введите кол-во"
                        min={0}
                        value={orderData.inDoorQuantity}
                        error={orderStore.errors.inDoorQuantity}
                        className="number-input input-bottom"
                        onChange={(e) => {
                            const newValue = e.target.value;
                            setOrderData({ ...orderData, inDoorQuantity: Number(newValue) });
                            orderStore.setField("inDoorQuantity", newValue);
                        }}
                    />
                </label>
            </div>
            <div className="submit-wrapper">
                <Button className="form-btn" type="submit" text={type === 'edit' ? "Изменить заказ" : "Подтвердить заказ"} />
            </div>
        </form>
    )
})