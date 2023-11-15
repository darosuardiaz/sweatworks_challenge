export const errorHandler = (errCode: number, error: string) => {
    return {
        statusCode: errCode,
        body: JSON.stringify({ error: `${error}` }),
    };
}
