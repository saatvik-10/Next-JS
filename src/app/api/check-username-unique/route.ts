import { z } from 'zod';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { usernameValidation } from '@/schemas/signUpSchema';

const UsernameQuerySchema = z.object({
  username: usernameValidation,
});

export async function GET(req: Request) {
  await dbConnect();
  try {
    const { searchParams } = new URL(req.url);
    const queryParam = {
      username: searchParams.get('username'),
    };

    //validating with Zod
    const result = UsernameQuerySchema.safeParse(queryParam);
    console.log(result);
    if (!result.success) {
      const usernameError = result.error.format().username?._errors || [];
      return Response.json(
        {
          success: false,
          message:
            usernameError?.length > 0
              ? usernameError.join(', ')
              : 'Invalid query parameter',
        },
        { status: 400 }
      );
    }

    const { username } = result.data;

    const existingVerifiesUser = await UserModel.findOne({
      username,
      isVerified: true,
    });
    if (existingVerifiesUser) {
      return Response.json(
        {
          success: false,
          message: 'Username is already taken',
        },
        { status: 400 }
      );
    }
    return Response.json(
      {
        success: true,
        message: 'Username is available',
      },
      { status: 200 }
    );
  } catch (err) {
    console.log('Error checking username', err);
    return Response.json(
      {
        success: false,
        message: 'Error checking username',
      },
      { status: 500 }
    );
  }
}
