// const asyncHandler = () => {} calling function
// const asyncHandler = () => { () => {} } calling higher order function
// const asyncHandler = () => { async() => {} } calling async higher order function
// const asyncHandler = () => { async() => {} } calling async higher order function, 
// but remove the curly braces

const asyncHandler = (fn) => async(req, res, next) => {
    try{
        await fn(req, res, next);
    } catch(error) {
        // Standardizing the error message, to maintain the consistency throughout the codebase
        res.status(error.code || 500).json({
            success: false,
            message: error.message
        })
    }
};

export {asyncHandler};

// Promise Method
// const asyncHandler = (requestHandler) => {
//     (req, res, next) => {
//         Promise.resolve(requestHandler(req, res, next))
//         .catch(error => next(error));
//     }
// }