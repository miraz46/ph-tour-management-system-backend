/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from "http-status-codes"
import { UserServices } from "./user.service";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";



// const createUser = async (req: Request, res: Response, next: NextFunction) => {
//     try {
//         // throw new AppError(httpStatus.BAD_REQUEST, "fake error")
//         const user = await UserServices.createUser(req.body);
//         res.status(httpStatus.CREATED).json({
//             message: "User created successfully",
//             user
//         })
//     } catch (err: any) {
//         console.log(err);
//         next(err)
//     }
// }


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body);
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User Created Successfully",
        data: user
    })
})

const getAllUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const result = await UserServices.getAllUsers();

    // res.status(httpStatus.OK).json({
    //     success: true,
    //     message: "All Users Retrieved Successfully",
    //     data: users
    // })

    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: "User Created Successfully",
        data: result.data,
        meta: result.meta
    })
})

export const UserController = {
    createUser,
    getAllUser
}