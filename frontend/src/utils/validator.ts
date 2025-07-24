export function isTvGardenUrl(url: string): boolean {
  return url.startsWith("https://tv.garden/");
}

export function isRadioGardenUrl(url: string): boolean {
  return url.startsWith("https://radio.garden");
}

export function isIptvOrgUrl(url: string): boolean {
  return url.startsWith("https://iptv-org.github.io/channels/");
}

export function isM3u8Url(url: string): boolean {
  return url.endsWith(".m3u8");
}

export function isYouTubeUrl(url: string): boolean {
  return url.startsWith("https://www.youtube.com/");
}

export function isYouTubeChannelUrl(url: string): boolean {
  return /^https:\/\/(www\.)?youtube\.com\/(channel\/UC[\w-]+|@[\w.-]+)(\/.*)?$/.test(url);
}

export function isMelistenUrl(url: string): boolean {
  return url.startsWith("https://www.melisten.sg/radio");
}