
const validateUserRegistration = (req, res, next) => {
    const { email, password, firstName, lastName, state } = req.body
    const errors = []

    if (!email) {
        errors.push("please add your email")
    }
    
    if(!password){
        errors.push("Please add your password")
    }

    if(errors.length > 0){
        return res.status(400).json({message: errors})
    }

    next()
}

export {validateUserRegistration}
