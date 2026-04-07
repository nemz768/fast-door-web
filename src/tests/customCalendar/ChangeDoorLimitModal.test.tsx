import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { ChangeDoorsLimitModal } from '@/modules/customCalendar/ChangeDoorLimits/ChangeDoorLimitModal';
import { calendarStore } from '@/stores/calendarStore';

jest.mock('@/stores/calendarStore', () => ({
  calendarStore: {
    editCalendarDate: jest.fn(),
  },
}));

describe('ChangeDoorsLimitModal boundary cases', () => {
  const onClose = jest.fn();
  const onSuccess = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (calendarStore.editCalendarDate as jest.Mock).mockResolvedValue(undefined);
  });

  test('пустое значение преобразуется в 0', () => {
    render(
      <ChangeDoorsLimitModal
        date="2026-04-10"
        frontDoorQuantity={5}
        inDoorQuantity={7}
        available={true}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );

    const frontInput = screen.getByLabelText('Входные двери:') as HTMLInputElement;
    fireEvent.change(frontInput, { target: { value: '' } });
    expect(frontInput.value).toBe('0');
  });

  test('входные значения с ведущими нулями обрезаются', () => {
    render(
      <ChangeDoorsLimitModal
        date="2026-04-10"
        frontDoorQuantity={5}
        inDoorQuantity={7}
        available={true}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );

    const innerInput = screen.getByLabelText('Межкомнатные двери:') as HTMLInputElement;
    fireEvent.change(innerInput, { target: { value: '007' } });
    expect(innerInput.value).toBe('7');
  });

  test('submit отправляет числовые значения без ведущих нулей', async () => {
    render(
      <ChangeDoorsLimitModal
        date="2026-04-10"
        frontDoorQuantity={5}
        inDoorQuantity={7}
        available={true}
        onClose={onClose}
        onSuccess={onSuccess}
      />
    );

    const frontInput = screen.getByLabelText('Входные двери:') as HTMLInputElement;
    const innerInput = screen.getByLabelText('Межкомнатные двери:') as HTMLInputElement;

    fireEvent.change(frontInput, { target: { value: '003' } });
    fireEvent.change(innerInput, { target: { value: '012' } });

    fireEvent.click(screen.getByRole('button', { name: 'Изменить' }));

    await waitFor(() => {
      expect(calendarStore.editCalendarDate).toHaveBeenCalledWith([
        {
          date: '2026-04-10',
          frontDoorQuantity: 3,
          inDoorQuantity: 12,
          available: true,
        },
      ]);
    });
    expect(onSuccess).toHaveBeenCalled();
  });
});