
export default class GeneralError extends Error {
  
  public errorCode: number;

  constructor(message: string, errorCode: number) {
    super(message);
    
    this.name = 'GeneralError';
    this.errorCode = errorCode;
  }
}