import { unified } from "unified";
import remarkParse from "remark-parse";
import type { Parent, Root, RootContent } from "mdast";
import type { BulletListNode, ContentBlock, TextNode } from "./types";
import { toString } from "mdast-util-to-string";

function convertInlines(mdNode: RootContent): TextNode[] {
  if (!mdNode) return [];

  if (Array.isArray(mdNode)) {
    return mdNode.flatMap((node) => convertInlines(node));
  }

  if (mdNode.type === "heading") {
    return [{ type: "bold", children: mdNode.children.flatMap(convertInlines)}, "\n\n"]
  }

  if (mdNode.type === "text") {
    return [mdNode.value];
  }

  if (mdNode.type === "strong") {
    return [
      { type: "bold", children: mdNode.children.flatMap(convertInlines) },
    ];
  }

  if (mdNode.type === "emphasis") {
    return [
      { type: "italic", children: mdNode.children.flatMap(convertInlines) },
    ];
  }

  if (mdNode.type === "delete") {
    return [
      {
        type: "strikethrough",
        children: mdNode.children.flatMap(convertInlines),
      },
    ];
  }

  if (mdNode.type === "inlineCode") {
    return [{ type: "codeSpan", text: mdNode.value }];
  }

  if (mdNode.type === "code") {
    return [{ type: "codeSpan", text: `\n${mdNode.value.trim()}` }, "\n\n"];
  }

  if (mdNode.type === "link") {
    const children = mdNode.children.flatMap(convertInlines);
    return [{ type: "link", url: mdNode.url, children }];
  }

  if (mdNode.type === "paragraph") {
    return mdNode.children.flatMap(convertInlines).concat(["\n\n"]);
  }

  // Unknown inline type -> try to pull `value` or `children`
  if ("value" in mdNode && typeof mdNode.value === "string") {
    return [mdNode.value];
  }

  if ("children" in mdNode) {
    return mdNode.children.flatMap(convertInlines);
  }

  return [];
}

export function markdownToContent(markdown: string): ContentBlock[] {
  const tree: Root = markdownToChunkedAST(markdown);

  const messages: ContentBlock[] = [];
  let currentMessage: TextNode[] = [];

  for (const node of tree.children) {
    if (node.type === "paragraph") {
      // push paragraph inline nodes
      currentMessage.push(...node.children.flatMap(convertInlines));
      // keep single newline between paragraphs if not already added
      if (
        currentMessage.length &&
        currentMessage[currentMessage.length - 1] !== "\n\n"
      ) {
        currentMessage.push("\n\n");
      }
    } else if (node.type === "list") {
      const bulletListNode: BulletListNode = {
        type: "bulletList",
        children: [],
      };
      currentMessage.push(bulletListNode);

      for (const li of node.children) {
        const parts: TextNode[] = li.children.flatMap(convertInlines);
        const children = recursivelyTrimEnd(parts);
        bulletListNode.children.push({ type: "bulletPoint", children });
      }

      // add newline after list
      currentMessage.push("\n");
    } else if (node.type === "thematicBreak") {
      // If the model outputs --- then we split it into a new message
      messages.push({ type: "text", children: currentMessage });
      currentMessage = [];
    } else {
      // fallback: convert inline content if available
      currentMessage.push(...convertInlines(node));
    }
  }

  if (currentMessage.length) {
    messages.push({ type: "text", children: currentMessage });
  }

  for (const msg of messages) {
    if (msg.type === "text") {
      msg.children = recursivelyTrimEnd(msg.children);
    }
  }

  return messages;
}

function recursivelyTrimEnd(parts: TextNode[]): TextNode[] {
  // trim trailing paragraph separators
  while (parts.length > 0) {
    const last = parts[parts.length - 1];

    // If it's a plain text node
    if (typeof last === "string") {
      const newLast = last.trimEnd();

      if (newLast === "") {
        // Empty string, cull that node and loop
        parts.pop();
        continue;
      }

      // Non-empty string, so we're done
      parts[parts.length - 1] = newLast;
      return parts;
    }

    // If it's a simple node, trim the end of the text and return
    if ("text" in last) {
      last.text = last.text.trimEnd();
      return parts;
    }

    // If it's a complex node, trim the end of its children and return
    if ("children" in last) {
      last.children = recursivelyTrimEnd(last.children);
      return parts;
    }

    
    const handledAll: never = last;
    throw "Unreachable";
  }

  return [];
}

const MAX_CHARS = 8000;

/**
 * SUUPER vibe-coded but it seems to work
 * 
 * Ensures that there is a thematic break (---) at least every `MAX_CHARS` characters in a markdown string.
 * It intelligently splits any oversized Markdown blocks.
 *
 * @param markdownString The input markdown string.
 * @returns The processed markdown string with thematic breaks.
 */
export function markdownToChunkedAST(markdownString: string): Root {
  const processor = unified().use(remarkParse);
  const tree = processor.parse(markdownString) as Root;

  const newChildren: RootContent[] = [];
  let charCountSinceLastBreak = 0;

  for (const node of tree.children) {
    const nodeLength = toString(node).length;

    if (node.type === 'thematicBreak') {
        newChildren.push(node);
        charCountSinceLastBreak = 0;
        continue;
    }

    if (nodeLength > MAX_CHARS) {
      // This block is too large and must be split.
      // First, insert a break if there's preceding content.
      if (charCountSinceLastBreak > 0) {
        newChildren.push({ type: 'thematicBreak' });
      }

      const splitNodes = splitNode(node, MAX_CHARS);

      // Add the split nodes, separated by thematic breaks.
      splitNodes.forEach((splitNode, index) => {
        newChildren.push(splitNode);
        if (index < splitNodes.length - 1) {
          newChildren.push({ type: 'thematicBreak' });
        }
      });

      // The new character count is the length of the very last chunk.
      charCountSinceLastBreak = toString(splitNodes[splitNodes.length - 1] ?? {}).length;

    } else {
      // This block is of a manageable size.
      if (charCountSinceLastBreak > 0 && charCountSinceLastBreak + nodeLength > MAX_CHARS) {
        newChildren.push({ type: 'thematicBreak' });
        charCountSinceLastBreak = 0;
      }
      newChildren.push(node);
      charCountSinceLastBreak += nodeLength;
    }
  }

  tree.children = newChildren;
  return tree;
}

/**
 * Recursively splits a Markdown AST node if its content length exceeds maxLength.
 * @param node The AST node to split.
 * @param maxLength The maximum character length allowed for a node.
 * @returns An array of smaller nodes of the same type.
 */
function splitNode(node: RootContent, maxLength: number): RootContent[] {
  // If the node itself is small enough, no split needed.
  if (toString(node).length <= maxLength) {
    return [node];
  }

  // --- Base Cases for Recursion ---

  // For code blocks, split the text value.
  if (node.type === 'code') {
    const chunks: RootContent[] = [];
    let remainingValue = node.value;
    while (remainingValue.length > 0) {
      // Find a good split point, preferring newlines
      let splitPoint = Math.min(remainingValue.length, maxLength);
      if (remainingValue.length > maxLength) {
        const lastNewline = remainingValue.substring(0, splitPoint).lastIndexOf('\n');
        // Split at the newline if it makes sense, otherwise force split at maxLength
        splitPoint = lastNewline > 0 ? lastNewline + 1 : splitPoint;
      }
      const chunkValue = remainingValue.substring(0, splitPoint);
      chunks.push({ ...node, value: chunkValue });
      remainingValue = remainingValue.substring(splitPoint);
    }
    return chunks;
  }

  // For simple text-based nodes (like `text`, `html`, `inlineCode`), split their value.
  if ('value' in node && typeof node.value === 'string') {
    const chunks: RootContent[] = [];
    let remainingValue = node.value;
    while (remainingValue.length > 0) {
      const chunkValue = remainingValue.substring(0, maxLength);
      chunks.push({ ...node, value: chunkValue });
      remainingValue = remainingValue.substring(maxLength);
    }
    return chunks;
  }

  // --- Recursive Step for Parent Nodes ---

  if ('children' in node) {
    const parentNode = node as Parent;
    const newChildren: RootContent[] = [];

    // First, recursively split all children to get manageable pieces.
    for (const child of parentNode.children) {
      newChildren.push(...splitNode(child, maxLength));
    }

    // Now, group the (potentially numerous) new children into chunks.
    const chunks: Parent[] = [];
    let currentChunkChildren: RootContent[] = [];
    let currentChunkLength = 0;

    for (const child of newChildren) {
      const childLength = toString(child).length;
      if (currentChunkLength > 0 && currentChunkLength + childLength > maxLength) {
        chunks.push({ ...parentNode, children: currentChunkChildren });
        currentChunkChildren = [child];
        currentChunkLength = childLength;
      } else {
        currentChunkChildren.push(child);
        currentChunkLength += childLength;
      }
    }
    // Add the final chunk.
    if (currentChunkChildren.length > 0) {
      chunks.push({ ...parentNode, children: currentChunkChildren });
    }
    return chunks as RootContent[];
  }

  // Fallback for unknown/un-splittable node types.
  return [node];
}