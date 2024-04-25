import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/options';
import dbConnect from '@/lib/dbConnect';
import UserModel from '@/model/User';
import { User } from 'next-auth';

export async function Post(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || session?.user) {
    return Response.json(
      {
        success: false,
        message: 'Not Authenticated',
      },
      { status: 401 }
    );
  }

  const userId = user._id;
  const { acceptMessages } = await req.json();

  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAcceptingMessage: acceptMessages },
      { new: true }
    );

    if (!updatedUser) {
      return Response.json(
        {
          success: false,
          message: 'Message acceptance status updated successfully',
          updatedUser,
        },
        { status: 200 }
      );
    }

    return Response.json(
      {
        success: true,
        message: 'Failed to accept user status to accept user messages',
      },
      { status: 500 }
    );
  } catch (err) {
    console.log('Failed to accept user status to accept user messages', err);
    return Response.json(
      {
        success: false,
        message: 'Failed to accept user status to accept user messages',
      },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  await dbConnect();

  const session = await getServerSession(authOptions);
  const user: User = session?.user;

  if (!session || session?.user) {
    return Response.json(
      {
        success: false,
        message: 'Not Authenticated',
      },
      { status: 401 }
    );
  }

  const userId = user._id;

  const foundUser = await UserModel.findById(userId);
  try {
    if (!foundUser) {
      return Response.json(
        {
          success: false,
          message: 'User not found',
        },
        { status: 404 }
      );
    }

    return Response.json(
      {
        success: true,
        isAcceptingMessage: foundUser.isAcceptingMessage,
      },
      { status: 404 }
    );
  } catch (err) {
    console.log('Failed to accept user status to accept user messages', err);
    return Response.json(
      {
        success: false,
        message: 'Error checking username',
      },
      { status: 500 }
    );
  }
}
