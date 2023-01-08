import React, { createContext, useContext, useEffect, useState } from 'react';

import { CargaHoras } from '../interfaces/appInterfaces';
import { AuthContext } from './AuthContext';
import { getCargaHorasSemana, postCargaHoras } from '../api/siaraApi';
import { useWeekRange } from '../hooks/useWeekRange';

type HorasContextProps = {
  horasSemana: CargaHoras[];
  loadHorasSemanaActual: () => Promise<void>
  addHorasSemanaActual: ( cargaHoras: CargaHoras ) => Promise<CargaHoras>
  updateHorasSemanaActual: ( cargaHoras: CargaHoras ) => Promise<CargaHoras>
}

export const HorasContext = createContext({} as HorasContextProps);

export const HorasProvider = ( { children }: any ) => {
  const [ horasSemana, setHorasSemana ] = useState<CargaHoras[]>([]);
  const { monday, sunday } = useWeekRange(new Date());
  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadHorasSemanaActual();
  }, [monday, sunday, user]);

  const loadHorasSemanaActual = async () => {
    if ( monday && sunday && user ) {
      const semanaActual = await getCargaHorasSemana(user.matrizGenerales.empId, monday, sunday);
      setHorasSemana(semanaActual);
    }
  };

  const addHorasSemanaActual = async ( cargaHoras: CargaHoras ) => {
    const resp = await postCargaHoras(cargaHoras);
    setHorasSemana([ ...horasSemana, resp ]);
    return resp;
  };

  const updateHorasSemanaActual = async ( cargaHoras: CargaHoras ) => {
    const data = await postCargaHoras(cargaHoras);
    setHorasSemana( horasSemana.map( (h) => ( h.idCargaHoras === cargaHoras.idCargaHoras ) ? data : h ) );
    return data;
  };

  return (
    <HorasContext.Provider value={{
      horasSemana,
      loadHorasSemanaActual,
      addHorasSemanaActual,
      updateHorasSemanaActual,
    }}>
      { children }
    </HorasContext.Provider>
  );
};
