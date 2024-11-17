export class SearchField {
  constructor(
  ) { }

  public label: string;
  public field: string;
  public type: string;

  setProperties(
    label: string,
    field: string,
    type: string,
  ): SearchField {
    this.label = label;
    this.field = field;
    this.type = type;
    return this;
  }
}
