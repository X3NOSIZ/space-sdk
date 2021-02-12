import { Identity, GetAddressFromPublicKey } from '@spacehq/users';
import { PrivateKey, publicKeyBytesFromString } from '@textile/crypto';
import { Buckets, PathAccessRole, PathItem, PushPathResult, Root } from '@textile/hub';
import { expect, use } from 'chai';
import * as chaiAsPromised from 'chai-as-promised';
import * as chaiSubset from 'chai-subset';
import dayjs from 'dayjs';
import { anyString, anything, deepEqual, instance, mock, verify, when } from 'ts-mockito';
import { v4 } from 'uuid';
import { Mailbox } from './mailbox';

use(chaiAsPromised.default);
use(chaiSubset.default);

const mockIdentity: Identity = PrivateKey.fromRandom();

describe('Mailbox', () => {
  it('should send mail', () => {
    const mb = new Mailbox({
      identity: mockIdentity,
      token: '',
      storageAuth: {
        key: 'random-key',
        token: 'token',
        sig: 'sig',
        msg: 'msg',
      },
    });

    // TODO
  });
});
