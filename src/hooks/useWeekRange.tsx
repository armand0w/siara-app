import { useEffect, useState } from 'react';

export const useWeekRange = ( today: Date ) => {
  const [ monday, setMonday] = useState<string | null>(null);
  const [ sunday, setSunday] = useState<string | null>(null);

  useEffect(() => {
    let auxM = new Date(today);
    let dayM = auxM.getDay();
    let diffM = auxM.getDate() - dayM + (dayM === 0 ? -6 : 1);
    setMonday( formatDateStringYYYYMMDD(new Date(auxM.setDate(diffM)), 0) );
  }, [today]);

  useEffect(() => {
    let auxS = new Date(today);
    let dayS = auxS.getDay();
    let diffS = auxS.getDate() - dayS + (dayS === 0 ? 0 : 7); // adjust when day is sunday
    setSunday( formatDateStringYYYYMMDD(new Date(auxS.setDate(diffS)), 0) );
  }, [today]);

  const formatDateStringYYYYMMDD = (date: Date, numdays: number) => {
    let d = new Date(date);
    d.setDate(d.getDate() + numdays);

    return d.getFullYear() + '-' + padLeft(d.getMonth() + 1) + '-' + padLeft(d.getDate());
  };

  const padLeft = (n: number) => {
    return ('00' + n).slice(-2);
  };

  return {
    monday,
    sunday,
  };
};
