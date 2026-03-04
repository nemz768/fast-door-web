import { orderStore } from "@/stores/orderStore";
import { InputMask } from "@react-input/mask";
import { useRouter } from "next/navigation";
import Button from "../button/button";
import { useEffect, useState } from "react";
import { observer } from "mobx-react-lite";


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
                       type === 'edit' ?  router.push('../listOrdersSeller') : router.push('./');
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
                        <input
                            type="text"
                            maxLength={25}
                            placeholder={"Введите ФИО"}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setOrderData({ ...orderData, fullName: newValue });
                                orderStore.setField("fullName", newValue);
                            }}
                            value={orderData.fullName}
                        />
                        <span className="input-error-text">
                            {orderStore.errors.fullName || "\u00A0"}
                        </span>
                    </label>
                    <label className="form-label">
                        Адрес:
                        <input
                            type="text"
                            maxLength={100}
                            placeholder="Введите адрес"
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setOrderData({ ...orderData, address: newValue });
                                orderStore.setField("address", newValue);
                            }}
                            value={orderData.address}
                        />
                        <span className="input-error-text">
                            {orderStore.errors.address || "\u00A0"}
                        </span>
                    </label>
                </div>
                <div className="create-form-block-subblock">
                    <label>
                        Номер телефона:
                        <InputMask
                            placeholder="+7 (___) ___-__-__"
                            mask="+7 (___) ___-__-__"
                            replacement={{ _: /\d/ }}
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setOrderData({ ...orderData, phone: newValue });
                                orderStore.setField("phone", newValue);
                            }}
                            value={orderData.phone}
                        />
                        <span className="input-error-text">
                            {orderStore.errors.phone || "\u00A0"}
                        </span>
                    </label>
                    <label>
                        Комментарий:
                        <input
                            type="text"
                            maxLength={150}
                            placeholder="Введите комментарий(необязательно)"
                            onChange={(e) => {
                                const newValue = e.target.value;
                                setOrderData({ ...orderData, messageSeller: newValue });
                                orderStore.setField("messageSeller", newValue);
                            }}
                            value={orderData.messageSeller}
                        />
                        <span className="input-error-text">
                            {orderStore.errors.messageSeller || "\u00A0"}
                        </span>
                    </label>
                </div>
            </div>
            <h2 className="create-form-subtitle">Укажите прочие данные</h2>
            <div className="create-form-block-subblock">
                <label>
                    Дата установки:
                    <input
                        onChange={(e) => {
                            const newValue = e.target.value;
                            setOrderData({ ...orderData, dateOrder: newValue });
                            orderStore.setField("dateOrder", newValue);
                        }}
                        className={`input-bottom ${orderStore.errors.dateOrder ? "input-error" : ""}`}
                        type="date"
                        value={orderData.dateOrder}
                    />
                </label>
                <label>
                    Кол-во входных дверей:
                    <input
                        type="number"
                        placeholder="Введите кол-во"
                        min={0}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            setOrderData({ ...orderData, frontDoorQuantity: Number(newValue) });
                            orderStore.setField("frontDoorQuantity", newValue);
                        }}
                        value={orderData.frontDoorQuantity}
                        className={`number-input input-bottom ${orderStore.errors.frontDoorQuantity ? "input-error" : ""}`}
                    />
                    <span className="input-error-text">
                        {orderStore.errors.frontDoorQuantity || "\u00A0"}
                    </span>
                </label>
                <label>
                    Кол-во межкомнатных дверей:
                    <input
                        type="number"
                        placeholder="Введите кол-во"
                        min={0}
                        onChange={(e) => {
                            const newValue = e.target.value;
                            setOrderData({ ...orderData, inDoorQuantity: Number(newValue) });
                            orderStore.setField("inDoorQuantity", newValue);
                        }}
                        value={orderData.inDoorQuantity}
                        className={`number-input input-bottom ${orderStore.errors.inDoorQuantity ? "input-error" : ""}`}
                    />
                    <span className="input-error-text">
                        {orderStore.errors.inDoorQuantity || "\u00A0"}
                    </span>
                </label>
            </div>
            <div className="submit-wrapper">
                <Button className="form-btn" type="submit" text={type === 'edit' ? "Изменить заказ" : "Подтвердить заказ"} />
            </div>
        </form>
    )
})