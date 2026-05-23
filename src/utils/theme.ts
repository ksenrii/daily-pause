export function applyTheme(): void {
  const root = document.documentElement;
  root.dataset.theme = "light";
  root.classList.toggle("windows", /windows|win32/i.test(navigator.userAgent));
}
