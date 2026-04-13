function CafeIcon({ kind, className = "" }) {
  const icons = {
    analytics: (
      <path d="M4 18h16M7 15V9m5 6V5m5 10v-4" />
    ),
    arrowLeft: (
      <path d="m13 7-5 5 5 5M19 12H8" />
    ),
    arrowRight: (
      <path d="m11 7 5 5-5 5M5 12h11" />
    ),
    bell: (
      <>
        <path d="M6 9a6 6 0 1 1 12 0v4l2 2H4l2-2V9Z" />
        <path d="M10 19a2 2 0 0 0 4 0" />
      </>
    ),
    bolt: (
      <path d="M13 2 5 14h5l-1 8 8-12h-5l1-8Z" />
    ),
    browse: (
      <>
        <path d="M4 7h16" />
        <path d="M6 7V5h12v2" />
        <path d="M6 7v10h12V7" />
      </>
    ),
    burger: (
      <>
        <path d="M5 10c0-2.8 3.1-5 7-5s7 2.2 7 5" />
        <path d="M4 13h16" />
        <path d="M6 17h12" />
      </>
    ),
    cake: (
      <>
        <path d="M12 7c1-1 1-2.2 0-3" />
        <path d="M7 10h10v8H7z" />
        <path d="M5 10h14" />
      </>
    ),
    cart: (
      <>
        <path d="M4 6h2l2.2 9h8.9L19 8H7.2" />
        <path d="M10 19a1 1 0 1 0 0 .01M17 19a1 1 0 1 0 0 .01" />
      </>
    ),
    chat: (
      <path d="M5 18v-3a7 7 0 1 1 3 5.8L5 18Z" />
    ),
    clock: (
      <>
        <path d="M12 6v6l4 2" />
        <path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20Z" />
      </>
    ),
    copy: (
      <>
        <path d="M9 9h10v10H9z" />
        <path d="M5 15H4V5h10v1" />
      </>
    ),
    check: (
      <>
        <path d="M20 6 9 17l-5-5" />
      </>
    ),
    cup: (
      <>
        <path d="M6 8h9v5a4 4 0 0 1-4 4H10a4 4 0 0 1-4-4V8Z" />
        <path d="M15 9h1a2 2 0 0 1 0 4h-1" />
        <path d="M8 4c1 1 1 2 0 3M11 3c1 1 1 2 0 3M14 4c1 1 1 2 0 3" />
      </>
    ),
    gift: (
      <>
        <path d="M4 10h16v10H4z" />
        <path d="M12 10v10M4 14h16" />
        <path d="M12 10H8.5a2.5 2.5 0 1 1 2.2-4H12v4Zm0 0h3.5a2.5 2.5 0 1 0-2.2-4H12v4Z" />
      </>
    ),
    heart: (
      <path d="m12 20-1.5-1.4C5.4 14 2 10.9 2 7.1 2 4 4.4 2 7.3 2c1.6 0 3.1.8 4 2.1C12.6 2.8 14.1 2 15.7 2 18.6 2 21 4 21 7.1c0 3.8-3.4 6.9-8.5 11.5L12 20Z" />
    ),
    home: (
      <>
        <path d="M5 11 12 5l7 6" />
        <path d="M7 10v8h10v-8" />
      </>
    ),
    leaf: (
      <>
        <path d="M19 5c-7 0-12 4-12 11 7 0 11-5 11-12Z" />
        <path d="M5 19c2-3 5-6 9-8" />
      </>
    ),
    mapPin: (
      <>
        <path d="M12 21s6-4.4 6-10a6 6 0 1 0-12 0c0 5.6 6 10 6 10Z" />
        <path d="M12 11a2 2 0 1 0 0 .01" />
      </>
    ),
    party: (
      <>
        <path d="M6 20 9 9l9 9" />
        <path d="M9 9 5 5" />
        <path d="m13 13 5-5" />
        <path d="M15 5h.01M19 9h.01M5 13h.01" />
      </>
    ),
    profile: (
      <>
        <path d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" />
        <path d="M5 20a7 7 0 0 1 14 0" />
      </>
    ),
    plus: (
      <>
        <path d="M12 5v14M5 12h14" />
      </>
    ),
    rewards: (
      <>
        <path d="M8 6h8l2 4-6 10L6 10l2-4Z" />
        <path d="M9 10h6" />
      </>
    ),
    share: (
      <>
        <path d="M15 8a3 3 0 1 0-2.8-4H12a3 3 0 0 0 .2 1.1L8.6 7.2a3 3 0 0 0-1.6-.5 3 3 0 1 0 1.6 5.5l3.6 2.1A3 3 0 0 0 12 15a3 3 0 1 0 .2 1.1l-3.6-2.1A3 3 0 0 0 9 11c0-.4-.1-.8-.2-1.1l3.6-2.1c.5.7 1.3 1.2 2.2 1.2Z" />
      </>
    ),
    settings: (
      <>
        <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
        <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 0 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 0 1-4 0v-.2a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 0 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 0 1 0-4h.2a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3h.1a1.7 1.7 0 0 0 1-1.5V3a2 2 0 0 1 4 0v.2a1.7 1.7 0 0 0 1 1.5h.1a1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 0 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8v.1a1.7 1.7 0 0 0 1.5 1H21a2 2 0 0 1 0 4h-.2a1.7 1.7 0 0 0-1.5 1Z" />
      </>
    ),
    spark: (
      <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
    ),
    send: (
      <>
        <path d="M22 2 11 13" />
        <path d="M22 2 15 22l-4-9-9-4 20-7Z" />
      </>
    ),
    star: (
      <path d="m12 3 2.7 5.5 6 .9-4.3 4.2 1 6-5.4-2.8-5.4 2.8 1-6L3.3 9.4l6-.9L12 3Z" />
    ),
    trash: (
      <>
        <path d="M4 7h16" />
        <path d="M10 11v6M14 11v6" />
        <path d="M6 7l1 12h10l1-12" />
        <path d="M9 7V5h6v2" />
      </>
    ),
    track: (
      <>
        <path d="M12 21s6-4.4 6-10a6 6 0 1 0-12 0c0 5.6 6 10 6 10Z" />
        <path d="M12 11a2 2 0 1 0 0 .01" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 4h8v3a4 4 0 0 1-8 0V4Z" />
        <path d="M9 20h6M12 15v5" />
        <path d="M16 5h2a2 2 0 0 1 0 4h-2M8 5H6a2 2 0 0 0 0 4h2" />
      </>
    ),
    wallet: (
      <>
        <path d="M4 7h16v10H4z" />
        <path d="M16 12h4" />
        <path d="M7 7V5h10v2" />
      </>
    ),
    work: (
      <>
        <path d="M3 8h18v11H3z" />
        <path d="M8 8V6h8v2" />
        <path d="M3 12h18" />
      </>
    ),
    x: (
      <>
        <path d="m18 6-12 12M6 6l12 12" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className={`cafe-icon ${className}`.trim()}>
      {icons[kind] || icons.spark}
    </svg>
  );
}

export default CafeIcon;
