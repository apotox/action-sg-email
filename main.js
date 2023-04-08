const core = require("@actions/core");
const glob = require("@actions/glob");
const fs = require("fs");
const path = require("path");
const sgMail = require("@sendgrid/mail");

async function getAttachments(attachments) {
  const globber = await glob.create(attachments.split(",").join("\n"));
  const files = await globber.glob();
  return files.map((f) => ({
    filename: path.basename(f),
    path: f,
    content_id: f.replace(/^.*[\\\/]/, ""),
  }));
}

async function sendMail() {
  const sgApiKey = core.getInput("sgApiKey", { required: true });
  const subject = core.getInput("subject", { required: true });
  const from = core.getInput("from", { required: true });
  const to = core.getInput("to", { required: true });
  const text = core.getInput("text", { required: false });
  const attachments = core.getInput("attachments", { required: false });


  sgMail.setApiKey(sgApiKey)

  sgMail.send({
    subject,
    from,
    to,
    text,
    attachments: await getAttachments(attachments)
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
