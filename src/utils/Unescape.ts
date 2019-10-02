/**
 * Converts HTML escaped strings.
 *
 * &lt;best&gt;kingsland&lt;/best&gt; converts to <best>kingsland</best>
 */
export default function decodeHtml(encodedStr: string): string {
  if (!encodedStr) {
    return ''
  }
  const doc = new DOMParser().parseFromString(encodedStr, 'text/html')
  const text = doc.documentElement.textContent + ''
  return text
}
