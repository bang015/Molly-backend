import { transporter } from "../config/email";

export const sendVerificationCode = async (email: string, code: string) => {
  await transporter.sendMail({
    from: '"Molly"<molly001504@gmail.com>',
    to: email,
    subject: `${code} is your code`,
    html: `<p>인증번호: ${code}`,
  });
}

export const sendPasswordResetLink = async(email: string, code: string)=> {
  const resetLink = `${process.env.REQ_ADDRESS}/auth/password/reset?code=${code}&email=${email}`;
  await transporter.sendMail({
    from: '"Molly"<molly001504@gmail.com>',
    to: email,
    subject: '비밀번호 재설정 요청',
    html: `<p>비밀번호를 재설정하려면 <a href="${resetLink}">여기</a>를 클릭하세요.</p>`,
  });
}