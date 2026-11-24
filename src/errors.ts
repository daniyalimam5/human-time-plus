/**
 * Thrown for any input human-time cannot make sense of: unparsable dates,
 * non-finite durations, or values of the wrong type.
 */
export class HumanTimeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'HumanTimeError';
    Object.setPrototypeOf(this, HumanTimeError.prototype);
  }
}
