const DATE = new Intl.DateTimeFormat('id-ID', { dateStyle: 'long', timeZone: 'Asia/Jakarta' });

export const formatDate = (d: Date) => DATE.format(d);
export const isoDate = (d: Date) => d.toISOString().slice(0, 10);
