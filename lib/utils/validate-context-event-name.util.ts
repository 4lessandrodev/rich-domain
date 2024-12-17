/**
 * @description Validates the format of an event name to ensure it follows the required pattern.
 * The expected pattern is `"contextName:EventName"`, where the event name must include a colon (`":"`)
 * to separate the context name and the event name.
 * 
 * @param eventName The event name to validate. Must be a string containing a colon (`":"`).
 * 
 * @throws {Error} Throws an error if the event name does not include a colon (`":"`).
 * 
 * @example
 * ```typescript
 * validateContextEventName("user:created"); // Passes validation
 * validateContextEventName("invalidEventName"); // Throws an error
 * ```
 */
export default function validateContextEventName(eventName: string): void {
    const message = 'Validation failed: Event name must follow the pattern "contextName:EventName". Please ensure to include a colon (":") in the event name to separate the context name and the event name itself.';
    if (!eventName.includes(':')) throw new Error(message);
}
