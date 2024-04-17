import dbConnect from "@/lib/dbConnect";
import UserModel from "@/model/User";

export async function POST(req: Request) {
    await dbConnect();

    try {
        const { username, code } = await req.json();
        const decodedUsername = decodeURIComponent(username);
        const user = await UserModel.findOne({ username: decodedUsername })

        if (!user) {
            return Response.json({
                success: false,
                message: "Username not found"
            }, { status: 404 })
        }
        const isCodeValid = user.verifyCode === code
        const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date()

        if (isCodeValid && isCodeNotExpired) {
            user.isVerified = true
            await user.save()
            return Response.json({
                success: true,
                message: "Account Verified Successfully"
            }, { status: 200 })
        }

        else if (!isCodeNotExpired) {
            return Response.json({
                success: false,
                message: "Verification Code Expired!! Please SignUp again"
            }, { status: 400 })
        }
        else {
            return Response.json({
                success: false,
                message: "Invalid Code"
            }, { status: 400 })
        }

    } catch (error) {
        console.error("Error Checking Verification Code", error)
        return Response.json({
            success: false,
            message: "Something went wrong while checking verification code"
        }, { status: 500 })
    }
}