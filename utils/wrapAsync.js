//wrapAsync function is used to handle an errors in server side.
//It is a function that accept a function as parameter and then return a function with parameters req, res, next;
//this return function executes the func function with same parameter with catch block if error occurred. 


module.exports = (func) => {
    return function(req, res, next){
        func(req, res, next).catch(next);
    }
}