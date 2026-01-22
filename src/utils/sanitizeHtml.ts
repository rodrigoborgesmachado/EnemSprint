import DOMPurify from 'dompurify'
type AnexoLike = { link: string }

function injectAnexoLinks(html: string, anexos?: AnexoLike[]): string {
  if (!anexos?.length) return html

  let result = html
  anexos.forEach((anexo, index) => {
    const id = `divAnexo${index}`
    const idRegex = new RegExp(`(<img[^>]*id=[\"']${id}[\"'][^>]*)(>)`, 'i')
    if (idRegex.test(result)) {
      result = result.replace(idRegex, (match, prefix: string, suffix: string) => {
        const hasSrc = /src=[\"'][^\"']*[\"']/.test(prefix)
        const updated = hasSrc
          ? prefix.replace(/src=[\"'][^\"']*[\"']/, `src=\"${anexo.link}\"`)
          : `${prefix} src=\"${anexo.link}\"`
        return `${updated}${suffix}`
      })
      return
    }

    const fallback = new RegExp(`src=[\"']#[\"']`, 'i')
    if (fallback.test(result)) {
      result = result.replace(fallback, `src=\"${anexo.link}\"`)
    }
  })

  return result
}

export function sanitizeHtml(html: string, anexos?: AnexoLike[]): string {
  return DOMPurify.sanitize(injectAnexoLinks(html, anexos))
}

