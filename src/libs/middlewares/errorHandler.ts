export const errorHandler = (errCode: number, error: object) => {
    return {
        statusCode: errCode,
        body: JSON.stringify({ error: `${error}` }),
    };
}
