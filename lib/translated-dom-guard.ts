/**
 * Page translation (Chrome's built-in Google Translate) replaces the text nodes
 * React rendered with its own `<font>` elements. When React later removes or
 * moves one of those text nodes, the node is no longer a child of the parent
 * React remembers, so the DOM throws "Failed to execute 'removeChild' on
 * 'Node'" (or `insertBefore`). Nothing catches it below the root, so
 * `global-error` replaces the whole page (SPICESTARS-FRONTEND-14: a
 * Persian-locale visitor on /explore). React does not handle this itself:
 * facebook/react#11538.
 *
 * The guard wraps the two DOM methods. On a translated page, when the node is
 * not a child of this parent — the one case that would throw — it recovers
 * and calls `onRecover`:
 * - `removeChild` skips the removal. The node is already out of this parent,
 *   and the translated text stays in place, which is better than an error
 *   screen.
 * - `insertBefore` still inserts: before the child of this parent that now
 *   holds the anchor (the translator's wrapper), or at the end when the anchor
 *   left this parent. React assumes every insertion happened, so dropping one
 *   would lose new content and leave React's tree out of sync with the page.
 * Every other call goes to the original method unchanged, so on a page that is
 * not translated a real bug still throws.
 */

export type GuardedOperation = "removeChild" | "insertBefore";

/** Set once installed, so a second call (or a dev HMR re-run) does not wrap the wrappers. */
const INSTALLED = Symbol.for("spicestars.translatedDomGuard");

export function installTranslatedDomGuard(onRecover: (operation: GuardedOperation) => void): void {
  const proto = Node.prototype as Node & { [INSTALLED]?: true };
  if (proto[INSTALLED]) return;
  proto[INSTALLED] = true;

  const removeChild = proto.removeChild;
  proto.removeChild = function guardedRemoveChild<T extends Node>(this: Node, child: T): T {
    if (child.parentNode !== this && isPageTranslated(document)) {
      onRecover("removeChild");
      return child;
    }
    return removeChild.call(this, child) as T;
  };

  const insertBefore = proto.insertBefore;
  proto.insertBefore = function guardedInsertBefore<T extends Node>(
    this: Node,
    node: T,
    child: Node | null,
  ): T {
    if (child && child.parentNode !== this && isPageTranslated(document)) {
      onRecover("insertBefore");
      return insertBefore.call(this, node, childHolding(this, child)) as T;
    }
    return insertBefore.call(this, node, child) as T;
  };
}

/** The child of `parent` that contains `node`, or null when `node` is not inside `parent`. */
function childHolding(parent: Node, node: Node): Node | null {
  let current: Node | null = node;
  while (current && current.parentNode !== parent) current = current.parentNode;
  return current;
}

/**
 * True when a translator has rewritten the page. Google Translate marks
 * `<html>` with `translated-ltr` / `translated-rtl` and sets `lang` to the
 * target language. The app renders `<html lang="en">` only.
 */
export function isPageTranslated(doc: Document): boolean {
  const html = doc.documentElement;
  return (
    /\btranslated-(ltr|rtl)\b/.test(html.className) ||
    (html.lang !== "" && !/^en(-|$)/i.test(html.lang))
  );
}
