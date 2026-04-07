import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { useRouter } from 'next/navigation';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/stores/installerStore', () => ({
  installerStore: {
    createInstaller: jest.fn(),
  },
}));

import InstallerForm from '@/modules/installerForm/installerForm';
import { installerStore } from '@/stores/installerStore';

describe('InstallerForm boundary validation', () => {
  const mockedUseRouter = useRouter as jest.Mock;
  const pushMock = jest.fn();

  beforeEach(() => {
    mockedUseRouter.mockReturnValue({ push: pushMock });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('показывает ошибки, когда ФИО и телефон пустые', async () => {
    render(<InstallerForm flag="create" />);

    fireEvent.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(await screen.findByText('Введите ФИО')).toBeInTheDocument();
    expect(await screen.findByText('Введите полный номер телефона')).toBeInTheDocument();
    expect(installerStore.createInstaller).not.toHaveBeenCalled();
  });

  test('показывает ошибку, когда телефон содержит меньше 11 цифр', async () => {
    render(<InstallerForm flag="create" />);

    fireEvent.change(screen.getByPlaceholderText('Введите ФИО установщика...'), {
      target: { value: 'Иван Иванов' },
    });
    fireEvent.change(screen.getByPlaceholderText('+7 (___) ___-__-__'), {
      target: { value: '+7 (999) 123-45' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(await screen.findByText('Введите полный номер телефона')).toBeInTheDocument();
    expect(installerStore.createInstaller).not.toHaveBeenCalled();
  });

  test('приводит номер телефона к цифрам и вызывает создание', async () => {
    render(<InstallerForm flag="create" />);

    fireEvent.change(screen.getByPlaceholderText('Введите ФИО установщика...'), {
      target: { value: 'Иван Иванов' },
    });
    fireEvent.change(screen.getByPlaceholderText('+7 (___) ___-__-__'), {
      target: { value: '+7 (123) 456-78-90' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Добавить' }));

    await waitFor(() => {
      expect(installerStore.createInstaller).toHaveBeenCalledWith({
        fullName: 'Иван Иванов',
        phone: '71234567890',
      });
    });
    expect(pushMock).toHaveBeenCalledWith('./InstallersList');
  });

  test('пробельное ФИО считается пустым и выдаёт ошибку', async () => {
    render(<InstallerForm flag="create" />);

    fireEvent.change(screen.getByPlaceholderText('Введите ФИО установщика...'), {
      target: { value: '   ' },
    });
    fireEvent.change(screen.getByPlaceholderText('+7 (___) ___-__-__'), {
      target: { value: '+7 (999) 123-45-67' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Добавить' }));

    expect(await screen.findByText('Введите ФИО')).toBeInTheDocument();
    expect(installerStore.createInstaller).not.toHaveBeenCalled();
  });
});