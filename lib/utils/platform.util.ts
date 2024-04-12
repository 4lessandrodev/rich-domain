export const platform = {
    isNodeJs: (process: any) => typeof process !== 'undefined',
    isBrowser: (window: any) => typeof window !== 'undefined',
}
export default platform;
