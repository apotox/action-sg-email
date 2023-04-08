const core = require("@actions/core");
const sgMail = require("@sendgrid/mail");

async function sendMail() {
  const sgApiKey = core.getInput("sgApiKey", { required: true });
  const subject = core.getInput("subject", { required: true });
  const from = core.getInput("from", { required: true });
  const to = core.getInput("to", { required: true });
  const text = core.getInput("text", { required: false });

  sgMail.setApiKey(sgApiKey)

  return sgMail.send({
    subject,
    from,
    to,
    text,
  })
}

async function main() {
  try {
    await sendMail()
  } catch (error) {
    core.setFailed(error.message);
  }
}

main();
