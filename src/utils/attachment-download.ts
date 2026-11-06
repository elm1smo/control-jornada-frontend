const FILE_FORMATS = [
  { prefix: 'iVBORw0KGgo', extension: 'png', type: 'image/png' },
  { prefix: '/9j/', extension: 'jpg', type: 'image/jpeg' },
  { prefix: 'R0lGOD', extension: 'gif', type: 'image/gif' },
  { prefix: 'Qk', extension: 'bmp', type: 'image/bmp' },
  { prefix: 'SUkqAA', extension: 'tif', type: 'image/tiff' },
  { prefix: 'TU0AKg', extension: 'tif', type: 'image/tiff' },
  { prefix: 'JVBERi0', extension: 'pdf', type: 'application/pdf' }
]

export function getAttachmentDownload(attachment: string, name: string) {
  let format = FILE_FORMATS.find((file) => attachment.startsWith(file.prefix))
  const header = atob(attachment.slice(0, 64))
  if (header.startsWith('RIFF') && header.slice(8, 12) === 'WEBP') {
    format = { prefix: '', extension: 'webp', type: 'image/webp' }
  }

  return {
    href: `data:${format?.type ?? 'application/octet-stream'};base64,${attachment}`,
    download: `${name}.${format?.extension ?? 'bin'}`
  }
}
