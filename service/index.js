import User from "../models/userModel"


const findOneUser = async ({email}) => {
    const user = User.findOne({ email })
    return user 
}

export default findOneUser