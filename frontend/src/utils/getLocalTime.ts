function getLocalTime(): string {
  const date = new Date().toLocaleString("en-US", {
    timeZone: "Asia/Manila"
  });
  const d = new Date(date);

  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  let hh = d.getHours();
  const min = String(d.getMinutes()).padStart(2, '0');
  const sec = String(d.getSeconds()).padStart(2, '0');
  const ampm = hh >= 12 ? 'PM' : 'AM';
  hh = hh % 12 || 12;
  const paddedHh = String(hh).padStart(2, '0');

  return `${yyyy}-${mm}-${dd} ${paddedHh}:${min}:${sec} ${ampm}`;
}