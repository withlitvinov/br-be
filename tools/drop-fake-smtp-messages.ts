import 'dotenv/config';

import * as process from 'node:process';

import { ImapFlow } from 'imapflow';

const imap = new ImapFlow({
  host: process.env.SMTP__HOST,
  port: 993,
  secure: true,
  auth: {
    user: process.env.SMTP__USER,
    pass: process.env.SMTP__PASSWORD,
  },
});

const main = async () => {
  await imap.connect();

  const lock = await imap.getMailboxLock('INBOX');

  try {
    await imap.messageDelete({
      all: true,
    });
  } finally {
    lock.release();
  }

  await imap.logout();
};

main().catch((err) => {
  console.log(err);
});
