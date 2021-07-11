import { ITrabajo } from 'app/entities/trabajo/trabajo.model';

export interface ITask {
  id?: string;
  title?: string | null;
  description?: string | null;
  trabajo?: ITrabajo | null;
}

export class Task implements ITask {
  constructor(public id?: string, public title?: string | null, public description?: string | null, public trabajo?: ITrabajo | null) {}
}

export function getTaskIdentifier(task: ITask): string | undefined {
  return task.id;
}
