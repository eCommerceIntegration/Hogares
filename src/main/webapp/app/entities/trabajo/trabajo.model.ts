import { ITask } from 'app/entities/task/task.model';
import { IEmpleado } from 'app/entities/empleado/empleado.model';

export interface ITrabajo {
  id?: string;
  trabajoTitle?: string | null;
  minSalary?: number | null;
  maxSalary?: number | null;
  tasks?: ITask[] | null;
  empleado?: IEmpleado | null;
}

export class Trabajo implements ITrabajo {
  constructor(
    public id?: string,
    public trabajoTitle?: string | null,
    public minSalary?: number | null,
    public maxSalary?: number | null,
    public tasks?: ITask[] | null,
    public empleado?: IEmpleado | null
  ) {}
}

export function getTrabajoIdentifier(trabajo: ITrabajo): string | undefined {
  return trabajo.id;
}
