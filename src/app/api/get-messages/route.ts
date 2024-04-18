import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";
import { User } from "next-auth";
import mongoose from "mongoose";

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

    const userId = new mongoose.Types.ObjectId(user._id);

    try {
        const user = await UserModel.aggregate([
            { $match: { _id: userId } },
            { $unwind: "$messages" },
            { $sort: { 'messages.createdAt': -1 } },
            { $group: { _id: '$_id', messages: { $push: '$messages' } } }
        ])

        if (!user || user.length === 0) {
            return Response.json(
                {
                    success: false,
                    message: "Messages unable to fetch"
                },
                { status: 500, statusText: "Internal Server Error" }
            )
        }

        return Response.json(
            {
                success: true,
                messages: user[0].messages
            },
            { status: 200 }
        )
    } catch (error) {
        
        console.log(error)
        return Response.json(
            {
                success: false,
                message: "Internal Server Error", error
            },
            { status: 500 }
        )

    }

}