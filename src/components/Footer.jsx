export default function Footer({ t, waUrl, mailUrl }) {
  return (
    <footer>
      <div className="footer-ornament">
        <div className="line"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="dot"></div>
        <div className="line"></div>
      </div>
      <img className="footer-logo" src="/apple-touch-icon.png" alt="" aria-hidden="true" />
      <div className="footer-name">Diego Jurfest</div>
      <div className="footer-credential">{t.footer_credential}</div>
      <div className="footer-services">{t.footer_services}</div>
      <div className="footer-contact">
        <a href={waUrl} target="_blank" rel="noopener noreferrer" onClick={() => window.gtag?.('event', 'whatsapp_click', { location: 'footer' })}>WhatsApp · +598 93 383 251</a>
        <span>·</span>
        <a href={mailUrl}>diegojurfest@gmail.com</a>
      </div>
      <div className="footer-meta">{t.footer_meta}</div>
      <div className="footer-bottom">{t.footer_bottom}</div>
    </footer>
  )
}
