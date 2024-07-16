
const responseTemplate = {
    successResponse: (Result = null) => {
        return {
            ResponseResult: {
                ErrorCode: 0, Message: "Success", Result
            }
        }
    },

    errorResponse: (ErrorCode, Message) => {
        return { ResponseResult: { 
            ErrorCode, 
            Message, 
            Result: null } 
        };
    },

    handlingErrorResponse: (error) => {
            return {
                ResponseResult: {
                ErrorCode: 404,
                Message: "Error during operation " + JSON.stringify(error),
                Result: error,
                }
            }
        }
}

export default responseTemplate