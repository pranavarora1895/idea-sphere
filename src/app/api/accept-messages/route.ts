import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";

export async function POST(req: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user = session?.user;

    if (!session || !user) {
        return Response.json(
            {
                success: false,
                message: "You are not logged in"
            },
            { status: 401, statusText: "Unauthorized" }
        )
    }

    const userId = user._id;
    const { acceptMessages } = await req.json();

    try {
        const updatedUser = await UserModel.findByIdAndUpdate(
            userId,
            { isAcceptingMessage: acceptMessages },
            { new: true }
        )
        if (!updatedUser) {
            console.log("User failed to update")
            return Response.json(
                {
                    success: false,
                    message: "User failed to update"
                },
                { status: 401 }
            )
        }

        return Response.json(
            {
                success: true,
                message: "User status for accepting messages updated successfully", updatedUser
            },
            { status: 200 }
        )

    } catch (error) {
        console.log("failed to update status of user accepting messages", error)
        return Response.json(
            {
                success: false,
                message: "failed to update status of user accepting messages"
            },
            { status: 500 }
        )
    }




}

export async function GET(req: Request) {
    await dbConnect();

    const session = await getServerSession(authOptions);
    const user: User = session?.user as User;

    if (!session || !user) {
        return Response.json(
            {
                success: false,
                message: "You are not logged in"
            },
            { status: 401, statusText: "Unauthorized" }
        )
    }

    const userId = user._id;

    try {
        const foundUser = await UserModel.findById(userId);

        if (!foundUser) {
            console.log("User failed to fetch")
            return Response.json(
                {
                    success: false,
                    message: "User failed to fetch"
                },
                { status: 401 }
            )
        }
        return Response.json(
            {
                success: true,
                isAcceptingMessages: foundUser.isAcceptingMessage
            },
            { status: 200 }
        )
    } catch (error) {

        return Response.json(
            {
                success: false,
                message: "User message accepting status failed to fetch", error
            },
            { status: 401 }
        )

    }
}
