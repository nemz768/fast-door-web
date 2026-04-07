import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import Reports from '@/modules/reports/reports';
import { reportsStore } from '@/stores/reportsStore';

jest.mock('@/modules/adminCalendar/adminCalendar', () => ({
  __esModule: true,
  default: () => <div data-testid="admin-calendar" />,
}));

jest.mock('@/stores/reportsStore', () => {
  const reportsStore = {
    getSellersStore: jest.fn().mockResolvedValue(undefined),
    getReportData: jest.fn().mockResolvedValue(undefined),
    postReportData: jest.fn().mockResolvedValue(undefined),
    loading: false,
    sellers: [],
    data: [],
  };
  return { reportsStore };
});

describe('Reports form boundary validation', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    reportsStore.sellers = [];
  });

  test('показывает все ошибки при пустой отправке', async () => {
    render(<Reports />);

    fireEvent.click(screen.getByRole('button', { name: 'Создать отчет' }));

    expect(await screen.findByPlaceholderText('Введите название отчета')).toBeInTheDocument();
    expect(screen.getByText('Выберите магазины')).toBeInTheDocument();
    expect(screen.getByText('Дата начала')).toBeInTheDocument();
    expect(screen.getByText('Дата окончания')).toBeInTheDocument();
    expect(reportsStore.postReportData).not.toHaveBeenCalled();
  });

  test('показывает ошибку, когда дата окончания раньше даты начала', async () => {
    reportsStore.sellers = ['Магазин 1'];
    render(<Reports />);

    fireEvent.change(screen.getByPlaceholderText('Введите название...'), {
      target: { value: 'Тестовый отчёт' },
    });

    const selectControl = document.querySelector('.custom-select__control');
    expect(selectControl).toBeInTheDocument();
    if (selectControl) {
      fireEvent.mouseDown(selectControl);
      expect(await screen.findByText('Магазин 1')).toBeInTheDocument();
      fireEvent.click(screen.getByText('Магазин 1'));
    }

    fireEvent.change(screen.getByPlaceholderText('Начало периода'), {
      target: { value: '2026-05-10' },
    });
    fireEvent.change(screen.getByPlaceholderText('Конец периода'), {
      target: { value: '2026-05-01' },
    });

    fireEvent.click(screen.getByRole('button', { name: 'Создать отчет' }));

    expect(await screen.findByText('Дата окончания раньше начала')).toBeInTheDocument();
    expect(reportsStore.postReportData).not.toHaveBeenCalled();
  });
});