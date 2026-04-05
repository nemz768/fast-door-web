import { orderStore } from "@/stores/orderStore";

import { useRouter } from "next/navigation";
import Button from "../button/button";
import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import Input from "../input/input";
import MaskedInput from "../inputMask/MaskedInput";
import { formatPhone } from "../formatPhone/formatPhone";
import './sellerForm.scss'
import { warning } from "../RequestStatus/requestStatus";
import UniversalCalendar from "../customCalendar/customCalendar";
import { calendarStore } from "@/stores/calendarStore";

interface SellerProps {
    id?: number;
    type?: 'create' | 'edit';
}

export const SellerForm = observer(({ id, type = 'create' }: SellerProps) => {
    const [showCalendar, setShowCalendar] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);


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
        const handleClickOutside = (e: MouseEvent) => {
            const target = e.target as HTMLElement;


            if (target.closest('.date-readonly-input')) return;

            if (
                calendarRef.current &&
                !calendarRef.current.contains(target)
            ) {
                setShowCalendar(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

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
                            phone: formatPhone(item.phone) || "",
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

    const displayDate = orderData.dateOrder
        ? orderData.dateOrder.split('-').reverse().join('.')
        : '';

    return (
        <form
            onSubmit={async (e) => {
                e.preventDefault();

                orderStore.setField("phone", orderData.phone);
                orderStore.setField("fullName", orderData.fullName);
                orderStore.setField("address", orderData.address);
                orderStore.setField("messageSeller", orderData.messageSeller);
                orderStore.setField("dateOrder", orderData.dateOrder);

                if (orderStore.validateForm()) {
                    const cleanPhone = orderData.phone.replace(/\D/g, '');
                    const dataToSend = { ...orderData, phone: cleanPhone };

                    let result;
                    if (type === 'edit' && id) {
                        result = await orderStore.editOrderSeller(id, dataToSend);
                    } else {
                        result = await orderStore.postOrderData({
                            ...orderStore.payload,
                            phone: cleanPhone
                        });
                    }

                    if (result) {
                        type === 'edit' ? router.push('../listOrdersSeller') : router.push('./');
                    } else {
                        warning(`Ошибка: ${orderStore.error}`);
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
                <label style={{ position: "relative" }}>
                    Дата установки:

                    <Input
                        readOnly
                        placeholder="Выберите дату"
                        value={displayDate}
                        onClick={(e) => {
                            e.stopPropagation();
                            setShowCalendar(prev => !prev);
                        }}
                        className={`date-readonly-input ${orderStore.errors.dateOrder ? "input-error" : ""}`}
                        style={{ cursor: "pointer" }}
                        name='dateOrder'
                        error={orderStore.errors.dateOrder}
                    />



                    {showCalendar && (
                        <div ref={calendarRef} className="date-calendar-popup">
                            <UniversalCalendar
                                fetchData={async () => {
                                    await calendarStore.fetchAll();
                                    return calendarStore.allData;
                                }}
                                showClosedDates={true}
                                multiSelect={false}
                                tileContentFn={(date, item) => {
                                    if (!item) return null;
                                    const isClosed = !item.available;
                                    const color = isClosed ? '#fff' : '#8b7355';
                                    return (
                                        <p className="calendar-tile-content" style={{ color, fontSize: '10px' }}>
                                            В: {item.frontDoorQuantity} М: {item.inDoorQuantity}
                                        </p>
                                    );
                                }}
                                onSelectDate={(date) => {
                                    if (!(date instanceof Date)) return;

                                    const formatted = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
                                    const item = calendarStore.allData.find(d => d.date === formatted);

                                    if (!item || !item.available) return;

                                    setOrderData(prev => ({ ...prev, dateOrder: formatted }));
                                    orderStore.setField("dateOrder", formatted);

                                    if (item) {
                                        if (orderData.frontDoorQuantity > item.frontDoorQuantity) {
                                            orderStore.errors.frontDoorQuantity = `Максимум ${item.frontDoorQuantity} на выбранную дату`;
                                        } else {
                                            delete orderStore.errors.frontDoorQuantity;
                                        }

                                        if (orderData.inDoorQuantity > item.inDoorQuantity) {
                                            orderStore.errors.inDoorQuantity = `Максимум ${item.inDoorQuantity} на выбранную дату`;
                                        } else {
                                            delete orderStore.errors.inDoorQuantity;
                                        }
                                    }

                                    setShowCalendar(false);
                                }}
                            />
                        </div>
                    )}
                </label>
                <label>
                    Кол-во входных дверей:
                    <Input
                        name="frontDoorQuantity"
                        type="number"
                        min={0}
                        className="number-input input-bottom"
                        value={orderData.frontDoorQuantity}
                        error={orderStore.errors.frontDoorQuantity}
                        onChange={(e) => {
                            const newValue = Number(e.target.value);
                            setOrderData(prev => ({ ...prev, frontDoorQuantity: newValue }));
                            orderStore.setField("frontDoorQuantity", newValue);
                        }}
                    />
                </label>
                <label>
                    Кол-во межкомнатных дверей:

                    <Input
                        name="inDoorQuantity"
                        type="number"
                        min={0}
                        className="number-input input-bottom"
                        value={orderData.inDoorQuantity}
                        error={orderStore.errors.inDoorQuantity}
                        onChange={(e) => {
                            const newValue = Number(e.target.value);
                            setOrderData(prev => ({ ...prev, inDoorQuantity: newValue }));
                            orderStore.setField("inDoorQuantity", newValue);
                        }}
                    />
                </label>
            </div>
            <div className="submit-wrapper">
                <Button
                    className="form-btn"
                    type="submit"
                    text={type === 'edit' ? "Изменить заказ" : "Подтвердить заказ"}
                />
            </div>
        </form>
    )
})