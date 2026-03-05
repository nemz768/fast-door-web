'use client';

import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './customCalendar.scss';
import { CalendarDateItem, calendarStore } from '@/stores/calendarStore';
import { observer } from 'mobx-react-lite';
import { ChangeDoorsLimitModal } from './ChangeDoorLimits/ChangeDoorLimitModal';
import lockW from '@/assets/images/lock-white.png'
import unlockW from '@/assets/images/unlock-white.png'
import editW from '@/assets/images/edit-white.png'
import TableButton from '../tableButton/tableButton';

interface UniversalCalendarProps {
  fetchData?: () => Promise<CalendarDateItem[]>;
  showClosedDates?: boolean;
  multiSelect?: boolean;
  tileContentFn?: (date: Date, item?: CalendarDateItem) => React.ReactNode;
  onSelectDate?: (date: Date | Date[]) => void;
  initialSelectedDates?: Date[];
  currentPage?: number;
  pageSize?: number;
  showActions?: boolean;
}

const UniversalCalendar = observer(({
  fetchData,
  showClosedDates = true,
  multiSelect = false,
  tileContentFn,
  onSelectDate,
  initialSelectedDates = [],
  currentPage = 0,
  pageSize = 10,
  showActions = false
}: UniversalCalendarProps) => {

  const [selectedDates, setSelectedDates] = useState<Date[]>(initialSelectedDates);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalDate, setModalDate] = useState<CalendarDateItem | null>(null);


  useEffect(() => {
    const loadDates = async () => {
      if (!fetchData) return setLoading(false);
      try {
        setLoading(true);
        setError(null);
        await fetchData();
      } catch (err) {
        setError('Ошибка загрузки дат');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadDates();
  }, [fetchData]);

  const calendarData = calendarStore.allData;
  const allowedDates = calendarData.map(d => new Date(d.date));
  const closedDates = calendarData.filter(d => !d.available).map(d => new Date(d.date));

  const formatDateKey = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

  const isDateAllowed = (date: Date) =>
    allowedDates.some(d => d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate());

  const isDateClosed = (date: Date) =>
    closedDates.some(d => d.getFullYear() === date.getFullYear() &&
      d.getMonth() === date.getMonth() &&
      d.getDate() === date.getDate());

  const isDateSelected = (date: Date) =>
    selectedDates.some(d => d.getTime() === date.getTime());

  const tileDisabled = ({ date }: { date: Date }) =>
    !isDateAllowed(date) && !isDateClosed(date);

  const tileClassName = ({ date }: { date: Date }) => {
    const classes: string[] = ['calendar-tile'];

    const allowed = isDateAllowed(date);
    const closed = isDateClosed(date);
    const selected = isDateSelected(date);

    if (!allowed && !closed) {
      classes.push('calendar-tile-disabled');
      return classes.join(' ');
    }

    if (closed && selected) {
      classes.push('calendar-closed-selected');
      return classes.join(' ');
    }

    if (closed) {
      classes.push('calendar-tile-closed');
    }

    if (selected) {
      classes.push('calendar-selected');
    }

    if (!closed && !selected) {
      classes.push('calendar-tile-available');
    }

    return classes.join(' ');
  };

  const tileContent = ({ date }: { date: Date }) => {
    if (tileContentFn) {
      const item = calendarData.find(cd => cd.date === formatDateKey(date));
      return tileContentFn(date, item);
    }
    return null;
  };

  const handleDateClick = (date: Date) => {
    if (!isDateAllowed(date) && !isDateClosed(date)) return;

    if (multiSelect) {
      if (isDateSelected(date)) {
        const updated = selectedDates.filter(d => d.getTime() !== date.getTime());
        setSelectedDates(updated);
        onSelectDate?.(updated);
      } else {
        const updated = [...selectedDates, date];
        setSelectedDates(updated);
        onSelectDate?.(updated);
      }
    } else {
      setSelectedDates([date]);
      onSelectDate?.(date);
    }
  };

  const closeDates = async () => {
    if (!selectedDates.length) return;

    const payload = selectedDates.map(date => ({
      date: formatDateKey(date),
    }));

    await calendarStore.closeCalendarDates(payload);
    setSelectedDates([]);
  };

  const openDates = async () => {
    if (!selectedDates.length) return;

    const payload = selectedDates.map(date => ({
      date: formatDateKey(date),
    }));

    await calendarStore.openCalendarDates(payload);
    setSelectedDates([]);
  };

  const showChangeDoorLimitModal = () => {
    if (selectedDates.length !== 1) return;

    const dateKey = formatDateKey(selectedDates[0]);

    const item = calendarData.find(cd => cd.date === dateKey);

    if (!item) return;

    setModalDate(item);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setModalDate(null);
  };

  const handleModalSuccess = async () => {
    if (modalDate) {
      const updatedDate = new Date(modalDate.date);
      setSelectedDates([updatedDate]);
    }
    setIsModalOpen(false);
    setModalDate(null);
  };

  if (loading) return <div className="custom-calendar"><div className="calendar-loading">Загрузка календаря...</div></div>;
  if (error) return <div className="custom-calendar"><div className="calendar-error">{error}</div></div>;

  return (
    <div className="custom-calendar">
      <div className='custom-calendar-container'>
        <Calendar
          locale="ru-RU"
          showNeighboringMonth={false}
          minDetail="month"
          maxDetail="month"
          tileDisabled={tileDisabled}
          tileClassName={tileClassName}
          tileContent={tileContent}
          formatDay={(locale, date) => date.getDate().toString()}
          onClickDay={handleDateClick}
        />
      </div>
      <div className='custom-calendar-modal'>
        {isModalOpen && modalDate && (
          <ChangeDoorsLimitModal
            date={modalDate.date}
            frontDoorQuantity={modalDate.frontDoorQuantity}
            inDoorQuantity={modalDate.inDoorQuantity}
            available={modalDate.available}
            onClose={handleCloseModal}
            onSuccess={handleModalSuccess}
          />
        )}
      </div>

      {showActions && (
        <div className="custom-calendar-actions">
          <TableButton src={lockW.src} alt="lock" onClick={closeDates} />
          <TableButton src={unlockW.src} alt="unlock" onClick={openDates} />
          <TableButton src={editW.src} alt="edit" onClick={showChangeDoorLimitModal} />
        </div>
      )}
    </div>
  );
});

export default UniversalCalendar;