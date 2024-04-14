export default function validateContextEventName(eventName: string): void {
    const message = 'Validation failed: Event name must follow the pattern "contextName:EventName". Please ensure to include a colon (":") in the event name to separate the context name and the event name itself.';
    if (!eventName.includes(':')) throw new Error(message);
}
