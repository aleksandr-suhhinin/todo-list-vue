export enum TodoStatus {
  Hold = 'hold',
  InProgress = 'inProgress',
  Testing = 'testing',
  Completed = 'completed'
}
export interface Todo {
  id: number;
  title: string;
  text: string;
  createDate: Date;
  completionDate?: Date;
  completed: boolean;
  status: TodoStatus;
}
