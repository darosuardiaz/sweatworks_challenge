export const sendResponse = (status: number, responseObj: object) => {
    return {
        statusCode: status,
        body: JSON.stringify(responseObj),
    };
}