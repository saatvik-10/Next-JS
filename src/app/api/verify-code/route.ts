import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';

export async function POST(req: Request) {
  await dbConnect();
  try {
    const { username, code } = await req.json();
    const decodedUsername = decodeURIComponent(username);
    const user = await UserModel.findOne({ username: decodedUsername });

    if (!user) {
      return Response.json(
        {
          success: false,
          message: 'Error checking username',
        },
        { status: 500 }
      );
    }

    const isCodeValid = user.verifyCode === code;
    const isCodeNotExpired = new Date(user.verifyCodeExpiry) > new Date();

    if (isCodeValid && isCodeNotExpired) {
      user.isVerified = true;
      await user.save();
    } else if (!isCodeNotExpired) {
      return Response.json(
        {
          success: false,
          message:
            'Verfication code has expired, please sign-up again to get a new verification code',
        },
        { status: 400 }
      );
    } else {
      return Response.json(
        {
          success: false,
          message: 'Incorrect Verification Code',
        },
        { status: 400 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Account verified successfully',
      },
      { status: 200 }
    );
  } catch (err) {
    console.log('Error verifying user', err);
    return Response.json(
      {
        success: false,
        message: 'Error verifying user',
      },
      { status: 500 }
    );
  }
}
