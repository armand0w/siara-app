export interface LoginData {
  username: string;
  password: string;
}

export interface LoginResponse {
  accessToken: string;
  tokenType: string;
}

export interface Usuario {
  idUsuario: number;
  username: string;
  lastLogin: Date;
  idEstatus: number;
  idSuperiorUsuario: number;
  nivelJerarquico: number;
  matrizGenerales: MatrizGenerales;
  usuarioRol: UsuarioRol[];
  nombreEmpleadoLdap: string;
  lastLoginString: Date;
  superiorUsuarioString: null;
  idEmpleadoSuperior: null;
}

export interface CargaHoras {
  idCargaHoras?: number | null;
  cargaFecha?: string | null;
  cargaFechaCaptura?: Date;
  cargaHoras: number;
  cargaTitulo: string;
  cargaNotas: string;
  cargaAprobada?: boolean;
  cargaAprobadaFecha?: string | null;
  cargaDescripcion: string;
  matrizGenerales: MatrizGenerales;
  proyecto: Proyecto;
  tarea: Tarea;
  cargaFechaString?: string | null;
  cargaAprobadaFechaString?: null;
  fechaInicialString?: null;
  fechaFinalString?: null;
  empId?: number;
  idCliente?: null;
  idProyecto: number;
  editable?: boolean;
  borrable?: boolean;
}

export interface Proyecto {
  idProyecto: number;
  proyClave?: string;
  proyNomCorto?: string;
  proyDescripcion?: string;
  proyDetalles?: null;
  proyFacturable?: boolean;
  idEstatus?: number;
  clientes?: Cliente;
}

export interface Cliente {
  idCliente: number;
  cteClave: string;
  cteNomCorto: string;
  cteRazonSocial: string;
  cteSector: string;
  cteTelefonos: null;
  cteContacto: null;
  cteCorreoE: null;
  cteObs: null;
  idEstatus: number;
  direccion: null;
}

export interface ProyectoTarea {
  idProyectoTarea: null;
  proyectos: null;
  tareas: Tarea;
  idEstatus: null;
  fecha: null;
}

export interface Tarea {
  idTarea: number;
  tareaDescripcion?: string;
  idEstatus?: number;
  editable?: boolean;
}

export interface MatrizGenerales {
  empId: number;
  empNombres: string;
  empApellidoP: string;
  empApellidoM: string;
  empSexo: string;
  empFechaNac: Date;
  empFoto: null;
  empRfc: string;
  empCurp: string;
  empImss: string;
  empEdoCivil: null;
  empTelefonoFijo: null;
  empTelefonoMovil: string;
  empCorreoE: string;
  empTelefonoEmergencia: string;
  empParentescoEmergencia: string;
  empFechaAlta: Date;
  empFechaBaja: null;
  empSueldo: null;
  idRazonSoc: number;
  idNivel: null;
  idCategoria: null;
  idTipoNomina: number;
  idEstatus: number;
  empFechaNacString: null;
  empFechaBajaString: null;
  direccion: Direccion;
}

export interface Direccion {
  idDireccion: number;
  calle: string;
  numExt: null;
  numInt: null;
  colonia: string;
  alcaldiaMunicipio: string;
  cp: string;
  ciudad: string;
  estados: Estados;
  pais: string;
  entreCalle1: null;
  entreCalle2: null;
}

export interface Estados {
  idEstado: number;
  estado: string;
}

export interface UsuarioRol {
  idUsuarioRole: number;
  rol: Rol;
}

export interface Rol {
  idRol: number;
  rol: string;
}

export interface ServiceStatus {
  code: number | null;
  message: string;
}
