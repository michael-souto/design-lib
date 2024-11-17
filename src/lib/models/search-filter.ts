export class SearchFilter {
  constructor(
  ) { }

  public label?: string;
  public field?: string;
  public type?: string;
  public value?: string;

  setProperties(label: string, field: string, type: string, value: string): SearchFilter {
    this.label = label;
    this.field = field;
    this.type = type;
    this.value = value;
    return this;
  }
}
