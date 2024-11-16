export const loadScript = ({
  src,
  onLoad,
  onError,
}: {
  src: string;
  onLoad: () => void;
  onError: () => void;
}) => {
  if (document.querySelector(`script[src="${src}"]`)) {
    return onLoad();
  }
  const script = document.createElement('script');

  script.src = src;
  script.setAttribute('crossOrigin', 'anonymous');
  script.addEventListener('load', onLoad);
  script.addEventListener('error', onError);

  window.document.head.appendChild(script);
};
