import User from "../models/userModel.js"


const findOneUser = async ({email}) => {
    const user = User.findOne({ email })
    return user;
}

export default findOneUser