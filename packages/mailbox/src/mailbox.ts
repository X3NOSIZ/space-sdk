import { Users, Update, ThreadID, InboxListOptions, UserAuth, UserMessage, PrivateKey, Public, privateKeyFromString, PublicKey } from '@textile/hub';
import { Identity, SpaceUser, GetAddressFromPublicKey } from '@spacehq/users';
import { grpc } from '@improbable-eng/grpc-web';
import ee from 'event-emitter';
import { threadId } from 'worker_threads';

export interface MailboxConfig {
  textileHubAddress?: string;
  usersInit?: (auth: UserAuth) => Users;
}

const DefaultTextileHubAddress = 'https://webapi.hub.textile.io';

// TODO: move to common utils pkg? so we can avoid dep cycle
const isPkHex = (input: string): boolean => {
  const re = /[0-9A-Fa-f]{64}/g;
  return re.test(input);
};

const tryParsePublicKey = (pk: string): PublicKey => {
  const keyLength = 32;
  if (isPkHex(pk)) {
    return new PublicKey(Buffer.from(pk, 'hex').slice(0, keyLength));
  }

  const key = PublicKey.fromString(pk);
  if (key.pubKey.byteLength !== keyLength) {
    throw new Error(`invalid public key: ${pk}`);
  }

  return key;
};

export class Mailbox {
  constructor(private readonly user: SpaceUser, private readonly config: MailboxConfig = {}) {
    this.config.textileHubAddress = config.textileHubAddress ?? DefaultTextileHubAddress;
  }

  public static async CreateMailbox(user: SpaceUser, config: MailboxConfig = {}):Promise<Mailbox> {
    const mb = new Mailbox(user, config);
    await mb.getUsersClient().setupMailbox();
    return mb;
  }
  //   public async ListInboxMessages(opts: InboxListOptions):[]UserMessage {
  //     const messages = await this.client.listInboxMessages();
  //     const inbox = [];
  //     messages.forEach(async (msg) => {
  //       inbox.push(await this.messageDecoder(msg));
  //     });
  // PrivateKey.fromString

  //   };

  public async SendMessage(to: string, body:Uint8Array): Promise<UserMessage> {
    const toKey = tryParsePublicKey(to);
    return this.getUsersClient().sendMessage(this.user.identity, toKey, body);
  }

  private getUserAuth(): UserAuth {
    if (this.user.storageAuth === undefined) {
      // TODO: move this error to common package so it can be
      // imported without dep cycles
      throw new Error('Authentication Error');
    }
    return this.user.storageAuth;
  }

  private getUsersClient(): Users {
    return this.initUsers(this.getUserAuth());
  }

  private initUsers(userAuth: UserAuth): Users {
    if (this.config?.usersInit) {
      return this.config.usersInit(userAuth);
    }

    return Users.withUserAuth(userAuth, { host: this.config?.textileHubAddress });
  }

  // public WatchInbox():ee {

  // }

  // public Identity():PrivateKey {

  // }

  // private parseMessage(msgs:UserMessage[]) {

  // }

  /**
   * Decrypts a user's inbox messages using their PrivateKey
   */
  // messageDecoder = async (message: UserMessage): Promise<DecryptedInbox> => {
  //   const identity = PrivateKey.fromString(PrivateKeyIdentity);
  //   const bytes = await identity.decrypt(message.body);
  //   const body = new TextDecoder().decode(bytes);
  //   const { from } = message;
  //   const { readAt } = message;
  //   const { createdAt } = message;
  //   const { id } = message;
  //   return { body, from, readAt, sent: createdAt, id };
  // }
}
