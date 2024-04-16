export class Todo {
  constructor(
    public id: string,
    public title: string,
    public isComplete: boolean,
    public created: string, // Convertir la date en une chaîne de caractères avec toISOString()
    public itemContent: string = ''
  ) {}
}
