import { useState } from "react";
import { Facebook, Instagram, Linkedin, Leaf, Mail, Phone, Copy, Check } from "lucide-react";

const socialLinks = [
  {
    name: "Instagram",
    icon: Instagram,
    webUrl: "https://www.instagram.com/keshavan_4",
    appUrl: "instagram://user?username=keshavan_4",
  },
// COMMENT FACEBOOK OUT FOR NOW SINCE THEIR APP LINKS ARE NOT AVAILABLE
//   {
//     name: "Facebook",
//     icon: Facebook,
//     webUrl: "https://www.facebook.com/aoninaturals",
//     appUrl: "fb://profile/aoninaturals",
//   },
  {
    name: "LinkedIn",
    icon: Linkedin,
    webUrl: "https://www.linkedin.com/company/aoni-naturals",
    appUrl: "linkedin://company/aoni-naturals",
  },
];

const isMobile = () => {
  if (typeof navigator === "undefined") return false;
  return /Android|iPhone|iPad|iPod|Opera Mini|IEMobile|WPDesktop/i.test(
    navigator.userAgent
  );
};

const handleSocialClick = (link) => {
  if (isMobile()) {
    const start = Date.now();
    const fallbackTimer = setTimeout(() => {
      if (Date.now() - start < 1800) {
        window.location.href = link.webUrl;
      }
    }, 1500);

    window.location.href = link.appUrl;

    window.addEventListener(
      "focus",
      () => clearTimeout(fallbackTimer),
      { once: true }
    );
  } else {
    window.open(link.webUrl, "_blank", "noopener,noreferrer");
  }
};

const EMAIL = "careaoninaturals@gmail.com";
const PHONE = "+918303577326";
const PHONE_DISPLAY = "+91 83035 77326";

const handleEmailClick = () => {
  if (isMobile()) {
    window.location.href = `https://mail.google.com/mail/?view=cm&to=${EMAIL}`;
  } else {
    window.open(
      `https://mail.google.com/mail/?view=cm&to=${EMAIL}`,
      "_blank",
      "noopener,noreferrer"
    );
  }
};

const Footer = () => {
  const [copied, setCopied] = useState(false);

  const copyEmail = async (e) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(EMAIL);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = EMAIL;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <footer className="bg-base-300/60 border-t border-base-300">
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Leaf className="w-6 h-6 text-primary" />
              <h3 className="text-xl font-bold text-base-content tracking-tight">
                AONI NATURALS
              </h3>
            </div>
            <p className="text-base-content/60 text-sm leading-relaxed max-w-xs">
              Crafting pure, organic solutions for your hair & skin care needs.
              Born from nature, backed by tradition.
            </p>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base-content">Get in Touch</h4>
            <ul className="space-y-3 text-sm text-base-content/60">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary" />
                <button
                  onClick={handleEmailClick}
                  className="hover:text-primary transition-colors cursor-pointer"
                >
                  {EMAIL}
                </button>
                <button
                  onClick={copyEmail}
                  className="hover:text-primary transition-colors cursor-pointer"
                  title="Copy email"
                >
                  {copied ? (
                    <Check className="w-3.5 h-3.5 text-success" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary" />
                <a
                  href={`tel:${PHONE}`}
                  className="hover:text-primary transition-colors"
                >
                  {PHONE_DISPLAY}
                </a>
              </li>
            </ul>
          </div>

          {/* Socials */}
          <div className="space-y-4">
            <h4 className="font-semibold text-base-content">Follow Us</h4>
            <div className="flex gap-3">
              {socialLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleSocialClick(link)}
                  aria-label={link.name}
                  className="btn btn-circle btn-sm btn-ghost bg-base-100 hover:bg-primary hover:text-primary-content transition-all duration-200 shadow-sm"
                >
                  <link.icon className="w-4 h-4" />
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-base-300">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-base-content/50">
            © {new Date().getFullYear()} Aoni Naturals. All Rights Reserved.
          </p>
          <p className="text-xs text-base-content/40">
            Made with 🌿 in India
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
