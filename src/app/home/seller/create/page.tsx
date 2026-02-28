'use client'


import Button from "@/modules/button/button";
import HeaderCreation from "@/modules/headerCreation/headerCreation";
import Title from "@/modules/title/title";
import './sellerCreate.scss'
import { observer } from "mobx-react-lite";
import { orderStore } from "@/stores/orderStore";
import { InputMask } from '@react-input/mask';
import ProtectedRoute from "@/modules/security/protectedRoute";
import { useRouter } from "next/navigation";


const CreateOrderForm = observer(() => {

    const router = useRouter();


    return (
        <ProtectedRoute allowedRoles={['salespeople']}>
            <HeaderCreation />
            <div className="create-form-wrapper">
                <Title pageTitle={"Создание нового заказа"} />
                <form
                    onSubmit={async (e) => {
                        e.preventDefault();
                        if (orderStore.validateForm()) {
                            const result = await orderStore.postOrderData({ ...orderStore.payload });

                            if (result) {
                                alert("Заказ успешно создан!");
                                router.push('./');
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
                                    placeholder="Введите ФИО"
                                    {...orderStore.getInputProps("fullName")}
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
                                    {...orderStore.getInputProps("address")}
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
                                    {...orderStore.getInputProps("phone")}
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
                                    {...orderStore.getInputProps("messageSeller")}
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
                                {...orderStore.getInputProps("dateOrder")}
                                className={`input-bottom ${orderStore.errors.dateOrder ? "input-error" : ""}`}
                                type="date"
                            />
                        </label>
                        <label>
                            Кол-во входных дверей:
                            <input
                                type="number"
                                placeholder="Введите кол-во"
                                min={0}
                                {...orderStore.getInputProps("frontDoorQuantity")}
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
                                {...orderStore.getInputProps("inDoorQuantity")}
                                className={`number-input input-bottom ${orderStore.errors.inDoorQuantity ? "input-error" : ""}`}
                            />
                            <span className="input-error-text">
                                {orderStore.errors.inDoorQuantity || "\u00A0"}
                            </span>
                        </label>
                    </div>
                    <div className="submit-wrapper">
                        <Button className="form-btn" type="submit" text={"Подтвердить заказ"} />
                    </div>
                </form>
            </div>
        </ProtectedRoute>
    )
})

export default CreateOrderForm;
