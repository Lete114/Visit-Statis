import 'dotenv/config'
import process from 'node:process'
import nodemailer from 'nodemailer'
import type { SendMailOptions } from 'nodemailer'

const { VS_MAIL_HOST, VS_MAIL_PORT, VS_MAIL_USER, VS_MAIL_PASS } = process.env

let transporter: ReturnType<typeof init_mail>

function template(code: number) {
  return `
  <div
    style="
    font-family:consolas,Menlo,pingfang sc,microsoft yahei,sans-serif;
    font-weight:bold;
    display:flex;
    justify-content:center;
    margin-top:40px;
    word-break:break-word;
    hyphens:auto;
  "
  >
    <div
      style="
      box-shadow:0 0 30px 0 rgb(219,216,214);
      border-radius:5px;
      border-left:4px solid #e58a8a;
      border-right:4px solid #e58a8a;
      width:640px;
      max-width:100%;
    "
    >
      <div
        style="
        line-height:180%;
        padding:20px;
        color:#555;
        font-size:12px;
        margin-bottom:0;
      "
      >
        <h2
          style="
          border-bottom:1px solid #ddd;
          font-size:20px;font-weight:bold;
          padding-bottom:14px;
          margin:0;
        "
        >
          <span style="color:#e58a8a;">&gt;&gt;&gt;</span>
          邮箱验证码
        </h2>
        <div
          style="
          padding:0 12px 0 12px;
          margin-top:18px
        "
        >
          <div>
            <p>尊敬的客户：</p>
            <p style="text-indent:2em;">
              请填写以下验证码完成邮箱验证 (10分钟内有效)
            </p>
            <p
              style="
              font-size:36px;
              font-weight:bold;
              text-align:center;
              margin:40px 0;
            "
            >
              ${code}
            </p>
            <p style="color:#757575;">
              (本邮件由系统自动发出，请勿直接回复)
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>`
}

export async function send(to_mail: string, code: number) {
  if (!transporter) {
    transporter = init_mail()
  }

  await verify()

  const mailOptions: SendMailOptions = {
    from: VS_MAIL_USER,
    to: to_mail,
    subject: '邮箱验证码',
    html: template(code),
  }
  await transporter.sendMail(mailOptions)
}

function init_mail() {
  return nodemailer.createTransport({
    // eslint-disable-next-line ts/ban-ts-comment
    // @ts-expect-error
    host: VS_MAIL_HOST,
    port: VS_MAIL_PORT && +VS_MAIL_PORT,
    secure: true,
    auth: {
      user: VS_MAIL_USER,
      pass: VS_MAIL_PASS,
    },
  })
}

async function verify() {
  return transporter.verify().then(() => {
    // eslint-disable-next-line no-console
    console.log('SMTP mailbox configuration is normal')
    return true
  }).catch((error) => {
    // eslint-disable-next-line no-console
    console.log('SMTP mailbox configuration exception: ', error)
    return false
  })
}
