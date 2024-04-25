import { resend } from '@/lib/resend';
import VerificationEmail from '../../emails/Verification';
import { ApiResponse } from '@/types/ApiResponse';

export async function sendVerificationEmail(
  email: string,
  username: string,
  verifyCode: string
): Promise<ApiResponse> {
  try {
    await resend.emails.send({
      from: 'saatvikmadan529@gmail.com',
      to: email,
      subject: 'Verification Code | OTP',
      react: VerificationEmail({ username, otp: verifyCode }),
    });
    return {
      success: true,
      message: 'Verification email sent successfully',
    };
  } catch (err) {
    console.log('Error in sending verification email', err);
    return {
      success: false,
      message: 'Failed to send verification email',
    };
  }
}
