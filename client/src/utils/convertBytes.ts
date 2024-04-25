export const convertBytes = (bytes: number): number => {
    const BASE_NUM = 1024;
    return (bytes / (BASE_NUM * BASE_NUM)).toFixed(2);
}