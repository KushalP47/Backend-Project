// Making a class APIRespone, so that whenever we will call APIs, all the responses will be of same format 
// only for successful API response
class ApiResponse {
    constructor(statusCode, data, message = "Success"){
        this.statusCode = statusCode
        this.data = data
        this.message = message
        this.success = statusCode < 400
    }
}
export {ApiResponse};