import type { ContentBlock, TextBlock, TextNode } from "./types";

function stripProtocol(u: string) {
  return u.replace(/^https?:\/\//, "");
}

export function contentToMarkdown(content: ContentBlock[]): string {
  return content
    .map((block) => {
      if (block.type === "text") {
        return textBlockToMarkdown(block);
      }

      if (block.type === "file") {
        return `File Attached: ${block.filename}`;
      }

      if (block.type === "location") {
        return `Shared location: ${block.latitude}, ${block.longitude}`;
      }

      
      const handledAll: never = block;
      throw "unreachable";
    })
    .join("\n\n");
}

function textBlockToMarkdown(content: TextBlock): string {
  const out: string[] = [];

  function escapeMarkdownText(s: string) {
    // minimal escaping for Markdown special chars that would break plain text
    return s.replace(/\\/g, "\\\\").replace(/([*_~`[\]])/g, "\\$1");
  }

  function renderNodes(nodes: TextNode[]): string {
    return nodes.map(renderNode).join("");
  }

  function renderNode(node: TextNode): string {
    if (typeof node === "string") {
      return escapeMarkdownText(node);
    }

    if (node.type === "bold") {
      return `*${renderNodes(node.children)}*`;
    }

    if (node.type === "italic") {
      return `_${renderNodes(node.children)}_`;
    }

    if (node.type === "strikethrough") {
      return `~${renderNodes(node.children)}~`;
    }

    if (node.type === "codeSpan") {
      const text = node.text;
      if (text.includes("\n")) {
        return "```\n" + text.trim() + "\n```";
      } else {
        return "`" + text + "`";
      }
    }

    if (node.type === "link") {
      const label = renderNodes(node.children) || node.url;
      return `[${label}](${node.url})`;
    }

    if (node.type === "autoLink") {
      return node.text === node.url || node.text === stripProtocol(node.url)
        ? node.text
        : `[${escapeMarkdownText(node.text)}](${node.url})`;
    }

    if (node.type === "customEmoji") {
      return node.text;
    }

    if (node.type === "mention") {
      return "@" + escapeMarkdownText(node.text);
    }

    if (node.type === "bulletList") {
      const lines = node.children.map((child) => {
        if (typeof child === "string") return `- ${escapeMarkdownText(child)}`;
        if (child.type === "bulletPoint")
          return `- ${renderNodes(child.children)}`;
        return `- ${renderNode(child)}`;
      });
      return "\n" + lines.join("\n") + "\n";
    }

    if (node.type === "bulletPoint") {
      return `- ${renderNodes(node.children)}\n`;
    }

    if (node.type === "actionLink") {
      return renderNodes(node.children);
    }

    if (node.type === "actionButton") {
      return renderNodes(node.children);
    }

    // unknown node
    if ("children" in node) {
      return renderNodes((node as any).children);
    }

    if ("text" in node) {
      return escapeMarkdownText((node as any).text);
    }

    return "";
  }

  out.push(renderNodes(content.children));
  // Unescape paragraph separators escaped by escapeMarkdownText above
  return out.join("").replace(/\\\n\\\n/g, "\n\n").trim();
}
