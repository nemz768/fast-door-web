'use client';

import { InputMask } from '@react-input/mask';
import { observer } from 'mobx-react-lite';
import { useEffect, useState } from 'react';
import './installerForm.scss';
import Button from '../button/button';
import { installerStore } from '@/stores/installerStore';
import { useRouter } from 'next/navigation';

interface InstallerFromProps {
    id?: number;
    flag: 'create' | 'edit';
}

interface FormData {
    fullName: string;
    phone: string;
}

interface FormErrors {
    fullName?: string;
    phone?: string;
}

const InstallerForm = observer(({ flag, id }: InstallerFromProps) => {
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        fullName: '',
        phone: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});

    useEffect(() => {
        if (flag === 'edit' && id) {
            (async () => {
                const installer = await installerStore.getInstallerById(id);
                if (installer) {
                    setFormData({
                        fullName: installer.fullName || '',
                        phone: installer.phone || ''
                    });
                }
            })();
        }
    }, [flag, id]);

    const validate = () => {
        const newErrors: FormErrors = {};
        if (!formData.fullName.trim()) {
            newErrors.fullName = "Введите ФИО";
        }
        const phoneDigits = formData.phone.replace(/\D/g, '');
        if (!formData.phone || phoneDigits.length < 11) {
            newErrors.phone = "Введите полный номер телефона";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (field: keyof FormData, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }));
        setErrors(prev => ({ ...prev, [field]: undefined }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        try {
            if (flag === 'create') {
                installerStore.createInstaller({
                    fullName: formData.fullName,
                    phone: formData.phone
                });


                router.push('./InstallersList');
            } else if (flag === 'edit' && id) {
                installerStore.editInstaller(id, {
                    fullName: formData.fullName,
                    phone: formData.phone
                });
                router.push('../InstallersList');
            }
        } catch (err) {
            console.error("Ошибка при сохранении:", err);
        }
    };

    return (
        <form className="installer-form" onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(e);

        }}>
            <div className="installer-form-titleWrapper">
                <h2 className="installer-form__title">
                    Укажите данные установщика
                </h2>
            </div>

            <label className="installer-form__label">
                <span className="installer-form__label-text">ФИО:</span>
                <input
                    className={`installer-form__input ${errors.fullName ? 'error' : ''}`}
                    type="text"
                    maxLength={60}
                    placeholder="Введите ФИО установщика..."
                    value={formData.fullName}
                    onChange={e => handleChange('fullName', e.target.value)}
                />
                {errors.fullName && <span className="installer-form__error">{errors.fullName}</span>}
            </label>

            <label className="installer-form__label">
                <span className="installer-form__label-text">Номер телефона:</span>
                <InputMask
                    className={`installer-form__input ${errors.phone ? 'error' : ''}`}
                    placeholder="+7 (___) ___-__-__"
                    mask="+7 (___) ___-__-__"
                    replacement={{ _: /\d/ }}
                    value={formData.phone}
                    onChange={e => handleChange('phone', e.target.value)}
                />
                {errors.phone && <span className="installer-form__error">{errors.phone}</span>}
            </label>

            <div className="installer-form__actions">
                <Button
                    className="installer-form__button"
                    type="submit"
                    text={flag === 'edit' ? "Изменить" : "Добавить"}
                />
            </div>
        </form>
    );
});

export default InstallerForm;