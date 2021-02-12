/* eslint-disable no-unused-expressions */
import {
  AddItemsEventData,
  UserStorage,
  ShareKeyType,
} from '@spacehq/sdk';
import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as chaiSubset from 'chai-subset';
import { TestsDefaultTimeout } from './fixtures/configs';
import { authenticateAnonymousUser } from './helpers/userHelper';

use(chaiAsPromised.default);
use(chaiSubset.default);

describe('Users sharing data', () => {
  it('users can share, accept and view shared files', async () => {
    const { user } = await authenticateAnonymousUser();
    const txtContent = 'Some manual text should be in the file';

    const storage = new UserStorage(user);
    const uploadResponse = await storage.addItems({
      bucket: 'personal',
      files: [
        {
          path: 'top.txt',
          data: txtContent,
          mimeType: 'plain/text',
        },
      ],
    });

    await new Promise<AddItemsEventData>((resolve) => {
      uploadResponse.once('done', resolve);
    });

    // share with new user
    const shareResult = await storage.shareViaPublicKey({
      publicKeys: [{
        id: 'new-space-user@fleek.co',
      }],
      paths: [{
        bucket: 'personal',
        path: '/top.txt',
      }],
    });

    expect(shareResult.publicKeys).not.to.be.empty;
    expect(shareResult.publicKeys[0].type).to.equal(ShareKeyType.Temp);
    expect(shareResult.publicKeys[0].tempKey).not.to.be.empty;

    // TODO: verify new user can access file via uuid
  }).timeout(TestsDefaultTimeout);
});
