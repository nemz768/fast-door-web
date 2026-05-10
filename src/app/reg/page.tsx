'use client';

import { useState } from 'react';
import { observer } from 'mobx-react-lite';
import { runInAction } from "mobx";
import '../login/login.scss';
import './reg.scss';
import Input from '@/modules/input/input';
import Button from '@/modules/button/button';
import { useRouter } from 'next/navigation';
import { authStore } from '@/stores/authStore';

const MIN_PASSWORD_LENGTH = 8;

type FormValues = {
  login: string;
  password: string;
  confirmPassword: string;
};

const Reg = observer(() => {
  const [key, setKey] = useState('');
  const [keyError, setKeyError] = useState('');
  const [isKeyVerified, setIsKeyVerified] = useState(false);
  const [userInfo, setUserInfo] = useState<{ nickname: string; role: string } | null>(null);

  const [formValues, setFormValues] = useState<FormValues>({
    login: '',
    password: '',
    confirmPassword: '',
  });
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof FormValues, string>>>({});

  const router = useRouter();

  const handleKeyCheck = async () => {
    setKeyError('');

    if (!key.trim()) {
      setKeyError('Ключ обязателен');
      return;
    }

    try {
      const data = await authStore.CheckInviteCode(key.trim());
      setUserInfo(data);
      setIsKeyVerified(true);
    } catch {
      setKeyError(authStore.error || 'Неверный код приглашения');
    }
  };

  const handleFieldChange = (field: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: '' }));
    runInAction(() => {
      authStore.error = null;
    });
  };

  const validateForm = () => {
    const errors: Partial<Record<keyof FormValues, string>> = {};

    if (!formValues.login.trim()) {
      errors.login = 'Логин обязателен';
    } else if (formValues.login.trim().length < 3) {
      errors.login = 'Логин должен быть минимум 3 символа';
    }

    if (!formValues.password) {
      errors.password = 'Пароль обязателен';
    } else if (formValues.password.length < MIN_PASSWORD_LENGTH) {
      errors.password = `Пароль должен быть минимум ${MIN_PASSWORD_LENGTH} символов`;
    }

    if (!formValues.confirmPassword) {
      errors.confirmPassword = 'Подтвердите пароль';
    } else if (formValues.confirmPassword !== formValues.password) {
      errors.confirmPassword = 'Пароли не совпадают';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      await authStore.register({
        username: formValues.login,
        password: formValues.password,
        confirm: formValues.confirmPassword,
        inviteCode: key,
      });
      router.push('./reg/success');
    } catch {
      if (authStore.error === 'Пользователь с таким логином уже существует') {
        setFormErrors(prev => ({ ...prev, login: authStore.error! }));
        authStore.error = null;
      }
    }
  };

  return (
    <div className="login-page">
      <form className="login-form reg-form" onSubmit={handleSubmit}>
        <h1 className="login-title" style={{ fontSize: 46 }}>Регистрация</h1>

        <div className="reg-section">

          <label className="reg-label">
            Персональный ключ
            <div className="key-input-wrapper">
              <Input
                name="registrationKey"
                placeholder="Введите ключ"
                type="text"
                value={key}
                onChange={(e) => {
                  setKey(e.target.value);
                  setKeyError('');
                }}
                error={keyError}
                disabled={isKeyVerified}
                className={isKeyVerified ? 'verified' : ''}
              />
              {isKeyVerified && <span className="check-icon">✓</span>}
            </div>
            {isKeyVerified && userInfo && (
              <p className="reg-user-info">{userInfo.nickname} - {userInfo.role}</p>
            )}
          </label>
          {!isKeyVerified && (
            <div className="submit-button-wrapper">
              <Button
                text={authStore.isLoading ? 'Проверка...' : 'Проверить ключ'}
                type="button"
                onClick={handleKeyCheck}
                disabled={authStore.isLoading}
              />
            </div>
          )}
        </div>

        {isKeyVerified && userInfo && (
          <div className="reg-section reg-fields animate-visible">

            <label className="reg-label">
              Логин
              <Input
                name="login"
                placeholder="ivan_ivanov"
                type="text"
                value={formValues.login}
                onChange={(e) => handleFieldChange('login', e.target.value)}
                error={formErrors.login}
              />
            </label>

            <label className="reg-label">
              Пароль
              <Input
                name="password"
                placeholder="Минимум 8 символов"
                type="password"
                value={formValues.password}
                onChange={(e) => handleFieldChange('password', e.target.value)}
                error={formErrors.password}
              />
            </label>

            <label className="reg-label">
              Подтверждение пароля
              <Input
                name="confirmPassword"
                placeholder="Повторите пароль"
                type="password"
                value={formValues.confirmPassword}
                onChange={(e) => handleFieldChange('confirmPassword', e.target.value)}
                error={formErrors.confirmPassword}
              />
            </label>

            {authStore.error && (
              <p className="server-error">{authStore.error}</p>
            )}

            <div className="submit-button-wrapper">
              <Button
                text={authStore.isLoading ? 'Загрузка...' : 'Зарегистрироваться'}
                type="submit"
                disabled={authStore.isLoading}
              />
            </div>
          </div>
        )}
      </form>
    </div>
  );
});

export default Reg;