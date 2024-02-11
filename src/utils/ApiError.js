// Standardizing the API error messages, so that every error gets in same format, helps in debugging and maintaining consistency
class ApiError extends Error {
    constructor(
        statusCode,
        message = "Somethings went wrong",
        errors = [],
        stack = "",
    ){
        super(message)
        this.statusCode = statusCode,
        this.data = null,
        this.message = message,
        this.success = false
        this.errors = errors
        if(stack){
            this.stack = stack
        }else{
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export {ApiError};