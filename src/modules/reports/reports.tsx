import { reportsStore } from "@/stores/reportsStore";
import { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import './reports.scss'
import Input from "../input/input";
import CustomSelect from "../select/customSelect";
import Button from "../button/button";
import ReportList from "./reportList";
import AdminCalendar from "../adminCalendar/adminCalendar";
import { formatDate } from "../formatDate/formatDate";

interface FormErrors {
    title?: string;
    relatedUsers?: string;
    dateFrom?: string;
    dateTo?: string;
}

export default observer(function Reports() {
    const { postReportData, getSellersStore, sellers, data } = reportsStore;

    const [formData, setFormData] = useState({
        title: '',
        dateFrom: '',
        dateTo: '',
        relatedUsers: [] as string[]
    });

    const [errors, setErrors] = useState<FormErrors>({});
    const [isSubmitted, setIsSubmitted] = useState(false);
    const calendarRef = useRef<HTMLDivElement>(null);
    const [openCalendar, setOpenCalendar] = useState<'dateFrom' | 'dateTo' | null>(null);
    useEffect(() => {
        getSellersStore();
        reportsStore.getReportData();
    }, []);

    const validate = (): boolean => {
        const newErrors: FormErrors = {};
        let isValid = true;

        if (!formData.title.trim()) {
            newErrors.title = 'Введите название отчета';
            isValid = false;
        }

        if (!formData.relatedUsers || formData.relatedUsers.length === 0) {
            newErrors.relatedUsers = 'Выберите магазины';
            isValid = false;
        }

        if (!formData.dateFrom) {
            newErrors.dateFrom = 'Дата начала';
            isValid = false;
        }

        if (!formData.dateTo) {
            newErrors.dateTo = 'Дата окончания';
            isValid = false;
        }

        if (formData.dateFrom && formData.dateTo) {
            if (new Date(formData.dateFrom) > new Date(formData.dateTo)) {
                newErrors.dateTo = 'Дата окончания раньше начала';
                isValid = false;
            }
        }

        setErrors(newErrors);
        setIsSubmitted(true);
        return isValid;
    };

    const onSubmitHandler = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        const payload = {
            title: formData.title,
            dateFrom: formData.dateFrom,
            dateTo: formData.dateTo,
            relatedUsers: formData.relatedUsers
        };

        try {
            await postReportData(payload);
            setFormData({
                title: '',
                dateFrom: '',
                dateTo: '',
                relatedUsers: []
            });
            setErrors({});
            setIsSubmitted(false);
        } catch (err) {
            console.error(err);
        }
    };

    const handleChange = (field: keyof typeof formData) =>
        (e: React.ChangeEvent<HTMLInputElement>) => {
            setFormData(prev => ({ ...prev, [field]: e.target.value }));
            if (errors[field]) {
                setErrors(prev => ({ ...prev, [field]: undefined }));
            }
        };

    const handleUsersChange = (selected: string[]) => {
        setFormData(prev => ({ ...prev, relatedUsers: selected }));
        if (errors.relatedUsers) {
            setErrors(prev => ({ ...prev, relatedUsers: undefined }));
        }
    };


    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
                setOpenCalendar(null);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="reports-block">
            <ReportList reports={data} />
            <div className="reports-block-box">
                <h2 className="reports-block-box-title">Создать новый отчет</h2>
                <form className="reports-block-box-form" onSubmit={onSubmitHandler}>
                    <div className="form-group">
                        <Input
                            value={formData.title}
                            onChange={handleChange("title")}
                            name="title"
                            placeholder={isSubmitted && errors.title ? errors.title : "Введите название..."}
                            type="text"
                            className={isSubmitted && errors.title ? 'input-error' : 'reports-block-box-input'}
                        />
                    </div>

                    <div className="form-group">
                        <CustomSelect
                            options={sellers}
                            value={formData.relatedUsers}
                            placeholder={
                                isSubmitted && errors.relatedUsers
                                    ? errors.relatedUsers
                                    : "Выберите необходимые магазины"
                            }
                            onChange={handleUsersChange}
                            isMulti={true}
                            error={isSubmitted && !!errors.relatedUsers}
                        />
                    </div>

                    <h3 className="reports-block-box-form-subtitle">Выберите даты для формирования отчета</h3>
                    <div ref={calendarRef} className="reports-block-box-form-dateInputs">
                        <div className="date-input-wrapper" style={{ position: 'relative' }}>
                            <Input
                                readOnly
                                name="dateFrom"
                                value={formatDate(formData.dateFrom)}
                                onValueChange={(date) => {
                                    setFormData(prev => ({ ...prev, dateFrom: date }));
                                    if (errors.dateFrom) setErrors(prev => ({ ...prev, dateFrom: undefined }));
                                }}
                                onClick={() => setOpenCalendar(prev => prev === 'dateFrom' ? null : 'dateFrom')}
                                error={isSubmitted ? errors.dateFrom : undefined}
                                placeholder="Начало периода"
                                className={isSubmitted && errors.dateFrom ? 'input-error' : 'reports-block-box-form-dateInputs-input'}
                            />
                            {openCalendar === 'dateFrom' && (
                                <AdminCalendar
                                    value={formData.dateFrom}
                                    onChange={(date) => {
                                        setFormData(prev => ({ ...prev, dateFrom: date }));
                                        if (errors.dateFrom) setErrors(prev => ({ ...prev, dateFrom: undefined }));
                                        setOpenCalendar(null);
                                    }}
                                />
                            )}
                        </div>
                        <div className="date-input-wrapper" style={{ position: 'relative' }}>
                            <Input
                                readOnly
                                name="dateTo"
                                value={formatDate(formData.dateTo)}
                                onValueChange={(date) => {
                                    setFormData(prev => ({ ...prev, dateTo: date }));
                                    if (errors.dateTo) setErrors(prev => ({ ...prev, dateTo: undefined }));
                                }}
                                onClick={() => setOpenCalendar(prev => prev === 'dateTo' ? null : 'dateTo')}
                                error={isSubmitted ? errors.dateTo : undefined}
                                placeholder="Конец периода"
                                className={isSubmitted && errors.dateTo ? 'input-error' : 'reports-block-box-form-dateInputs-input'}
                            />
                            {openCalendar === 'dateTo' && (
                                <AdminCalendar
                                    value={formData.dateTo}
                                    onChange={(date) => {
                                        setFormData(prev => ({ ...prev, dateTo: date }));
                                        if (errors.dateTo) setErrors(prev => ({ ...prev, dateTo: undefined }));
                                        setOpenCalendar(null);
                                    }}
                                />
                            )}
                        </div>
                    </div>

                    <Button
                        disabled={reportsStore.loading}
                        text={reportsStore.loading ? "Загрузка..." : "Создать отчет"}
                        type="submit"
                        className="reports-form-submit-btn"
                    />
                </form>
            </div>
        </div>
    );
});