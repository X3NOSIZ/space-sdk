import { BrowserStorage, Users, UserStorage, VaultBackupType, Mailbox } from '@spacehq/sdk';
import { Update, ThreadID, InboxListOptions, UserAuth, UserMessage, PrivateKey, Public, privateKeyFromString, PublicKey } from '@textile/hub';
import { expect, use } from 'chai';
import * as chaiSubset from 'chai-subset';
import { TestsDefaultTimeout, TestUsersConfig } from './fixtures/configs';
import { authenticateAnonymousUser } from './helpers/userHelper';

use(chaiSubset.default);

describe('Mailbox interactions', () => {
  it('should be able to setup mailbox', async () => {
    const { user } = await authenticateAnonymousUser();
    const mb = await Mailbox.CreateMailbox(user);
  }).timeout(TestsDefaultTimeout);

  it('should be able to send a mail', async () => {
    const { user: user1 } = await authenticateAnonymousUser();
    const mb1 = await Mailbox.CreateMailbox(user1);

    const { user: user2, identity: receipient } = await authenticateAnonymousUser();
    const mb2 = await Mailbox.CreateMailbox(user2);

    const sentmsg = mb1.SendMessage(Buffer.from(receipient.public.bytes).toString('hex'), new Uint8Array(8));
    console.log('sentmsg: ', sentmsg);
  }).timeout(TestsDefaultTimeout);
});
