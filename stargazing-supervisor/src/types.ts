export interface MarkupNode {
  type: "bold" | "italic" | "strikethrough";
  children: TextNode[];
}

export interface BulletListNode {
  type: "bulletList";
  children: TextNode[];
}

export interface BulletPointNode {
  type: "bulletPoint";
  children: TextNode[];
}

export interface LinkNode {
  type: "link";
  url: string;
  children: TextNode[];
}

export interface ActionLinkNode {
  type: "actionLink";
  action: string;
  params: Record<string, string>;
  children: TextNode[];
}

export interface ActionButtonNode {
  type: "actionButton";
  action: string;
  params: Record<string, string>;
  children: TextNode[];
}

export interface CodeSpanNode {
  type: "codeSpan";
  text: string;
}

export interface AutoLinkNode {
  type: "autoLink";
  url: string;
  text: string;
}

export interface CustomEmojiNode {
  type: "customEmoji";
  text: string;
}

export interface MentionNode {
  type: "mention";
  id: string;
  text: string;
}

export type TextNode =
  | string
  | MarkupNode
  | BulletListNode
  | BulletPointNode
  | CodeSpanNode
  | LinkNode
  | AutoLinkNode
  | ActionLinkNode
  | ActionButtonNode
  | CustomEmojiNode
  | MentionNode;

export interface TextBlock {
  type: "text";
  children: TextNode[];
}

export interface VideoBlock {
  type: "file";
  subtype: "video";
  fileToken: FileToken;
  url: string;
  size: number;
  filename: string;
  width?: number;
  height?: number;
  duration?: number;
}

export interface ImageBlock {
  type: "file";
  subtype: "image";
  fileToken: FileToken;
  url: string;
  size: number;
  filename: string;
  width?: number;
  height?: number;
}

export interface AudioBlock {
  type: "file";
  subtype: "audio";
  fileToken: FileToken;
  url: string;
  size: number;
  filename: string;
  duration?: number;
}

export interface VoiceBlock {
  type: "file";
  subtype: "voice";
  fileToken: FileToken;
  url: string;
  size: number;
  filename: string;
  duration?: number;
}

export interface GenericFileBlock {
  type: "file";
  subtype?: undefined;
  fileToken: FileToken;
  url: string;
  size: number;
  filename: string;
}

export type FileBlock =
  | VideoBlock
  | ImageBlock
  | AudioBlock
  | VoiceBlock
  | GenericFileBlock;

export interface LocationBlock {
  type: "location";
  latitude: number;
  longitude: number;
}

export type ContentBlock = TextBlock | FileBlock | LocationBlock;

export type FileToken = string;
export type ConversationId = string;
export type MessageId = string;
export type UserId = string;
export type UnixMilliseconds = number;

export type Conversation = {
  id: ConversationId;
  subject: string | null;
  photoUrl: string | null;
  welcomeMessages: string[] | null;
  custom: { [name: string]: string };
  lastMessage: Message | null;
  participants: {
    [id: UserId]: {
      access: "ReadWrite" | "Read";
      notify: boolean | "MentionsOnly";
      isUnread: boolean;
    };
  };
  createdAt: UnixMilliseconds;
  topicId: string;
};

export type Message = {
  id: MessageId;
  conversationId: string;
  senderId: UserId | null;
  type: "UserMessage" | "SystemMessage";
  origin: "web" | "rest" | "email" | "import";
  createdAt: UnixMilliseconds;
  editedAt: UnixMilliseconds | null;
  text: string;
  attachment: FileBlock | null;
  location: [number, number] | null;
  content: ContentBlock[];
  custom: { [name: string]: string };
  readBy: UserId[];
  referencedMessageId: string | null;
};

export type User = {
  id: UserId;
  name: string;
  welcomeMessage: string;
  photoUrl: string;
  role: string;
  email: string[] | null;
  phone: string[] | null;
  custom: { [name: string]: string };
  availabilityText: string;
  locale: string;
  createdAt: UnixMilliseconds;
  pushTokens: { [token_id: string]: true | null } | null;
};
