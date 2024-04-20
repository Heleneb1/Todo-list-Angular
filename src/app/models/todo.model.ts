export class Todo {
  constructor(
    public id: string,
    public title: string,
    public isComplete: boolean,
    public created: Date, 
    public itemContent: string = ''
  ) {}
}
