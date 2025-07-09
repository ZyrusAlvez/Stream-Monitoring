export function isTvGardenUrl(url: string): boolean {
  return url.startsWith("https://tv.garden/");
}

export function isRadioGardenUrl(url: string): boolean {
  return url.startsWith("https://radio.garden/visit/");
}

export function isIptvOrgUrl(url: string): boolean {
  return url.startsWith("https://iptv-org.github.io/channels/");
}
