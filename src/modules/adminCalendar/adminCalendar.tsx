'use client';
import { useEffect } from 'react';
import Calendar from 'react-calendar';
import { observer } from 'mobx-react-lite';
import { calendarStore } from '@/stores/calendarStore';
import 'react-calendar/dist/Calendar.css';
import './adminCalendar.scss';

interface AdminCalendarProps {
    value?: string;
    onChange: (date: string) => void;
}

const AdminCalendar = observer(({ value, onChange }: AdminCalendarProps) => {
    useEffect(() => {
        calendarStore.handleGetCalendarDisabledDates();
    }, []);

    const calendarData = calendarStore.allData;

    const formatDateKey = (date: Date) =>
        `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;

    const tileClassName = ({ date }: { date: Date }) => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const isToday = date.toDateString() === today.toDateString();
        const key = formatDateKey(date);
        const item = calendarData.find(d => d.limitDate === key);
        const classes: string[] = ['admin-cal-tile'];
        if (isToday) classes.push('admin-cal-tile--today');
        if (!item) classes.push('admin-cal-tile--absent');
        return classes.join(' ');
    };

    const tileDisabled = ({ date }: { date: Date }) => {
        const key = formatDateKey(date);
        return !calendarData.find(d => d.limitDate === key);
    };

    return (
        <div className="datepicker-popup">
            <Calendar
                locale="ru-RU"
                showNeighboringMonth={true}
                minDetail="month"
                maxDetail="month"
                tileClassName={tileClassName}
                tileDisabled={tileDisabled}
                formatDay={(_, date) => date.getDate().toString()}
                formatMonthYear={(_, date) =>
                    `${date.toLocaleString('ru-RU', { month: 'long' })}\n${date.getFullYear()}`
                }
                onClickDay={(date) => onChange(formatDateKey(date))}
            />
        </div>
    );
});

export default AdminCalendar;