export abstract class Base {
  protected abstract record: Record;
  abstract send() : Promise<any>;
}

export interface Record {
  verb: unknown;
  actor: unknown;
  context: unknown
}

export interface Response {
  success: boolean,
  message: string
}
