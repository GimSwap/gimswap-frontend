export const openMetamaskUrl = (url: string) => {
  const a = document.createElement('a');
  a.href = url;
  a.target = '_self';
  document.body.appendChild(a);
  a.click();
  a.remove();
};
