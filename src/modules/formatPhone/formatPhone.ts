export const formatPhone = (phone: string): string => {
    const d = phone.replace(/\D/g, '');
    if (d.length === 11)
        return `+${d[0]} (${d.slice(1, 4)}) ${d.slice(4, 7)}-${d.slice(7, 9)}-${d.slice(9)}`;
    if (d.length === 10)
        return `+7 (${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6, 8)}-${d.slice(8)}`;
    return phone;
};