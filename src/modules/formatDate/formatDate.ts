    export function formatDate(date: string) {
        const d = new Date(date);
        return d.toLocaleDateString('ru-RU');
    }