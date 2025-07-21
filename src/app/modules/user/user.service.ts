import AppError from "../../errorHelpers/AppError";
import { IAuthProvider, IUser, Role } from "./user.interface";
import { User } from "./user.model";
import httpStatus from "http-status-codes"
import bcrypt from "bcryptjs";
import { envVars } from "../../config/env";
import { JwtPayload } from "jsonwebtoken";

const createUser = async (payload: Partial<IUser>) => {

    const { email, password, ...rest } = payload;
    const isUserExist = await User.findOne({ email })

    if (isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User already exist.")
    }

    const hashedPassword = await bcrypt.hash(password as string, Number(envVars.BCRYPT_SALT_ROUND));

    const authProvider: IAuthProvider = { provider: "credentials", providerId: email as string }

    const user = await User.create({
        email,
        password: hashedPassword,
        auths: [authProvider],
        ...rest
    })
    return user;
}

const updateUser = async (userId: string, payload: Partial<IUser>, decoedToken: JwtPayload) => {

    const ifUserExist = await User.findById(userId);
    if (!ifUserExist) {
        throw new AppError(httpStatus.NOT_FOUND, "User Not Found")
    }

    if (payload.role) {
        if (decoedToken.role === Role.USER || decoedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
        }
        if (payload.role === Role.SUPER_ADMIN && decoedToken.role === Role.ADMIN) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
        }
    }

    if (payload.isActive || payload.isDeleted || payload.isVerified) {
        if (decoedToken.role === Role.USER || decoedToken.role === Role.GUIDE) {
            throw new AppError(httpStatus.FORBIDDEN, "You are not authorized")
        }
    }
    if (payload.password) {
        payload.password = await bcrypt.hash(payload.password, envVars.BCRYPT_SALT_ROUND)
    }

    const newUpdatedUser = await User.findByIdAndUpdate(userId, payload, { new: true, runValidators: true });

    return newUpdatedUser

}


const getAllUsers = async () => {
    const users = await User.find({});

    const totalUsers = await User.countDocuments()
    return {
        data: users,
        meta: {
            total: totalUsers
        }
    }
}

export const UserServices = {
    createUser,
    updateUser,
    getAllUsers
}