import React from "react";

const navItemStyle = (isActive) => ({
  padding: "9px 12px",
  borderRadius: 10,
  border: `1px solid ${isActive ? "rgba(25, 118, 210, 0.35)" : "transparent"}`,
  background: isActive ? "rgba(25, 118, 210, 0.12)" : "transparent",
  color: isActive ? "#0f5aa5" : "rgba(15, 23, 42, 0.82)",
  fontWeight: isActive ? 800 : 650,
  transition: "background 150ms ease, border-color 150ms ease, color 150ms ease",
});

function getPathname() {
  try {
    return window.location.pathname || "/";
  } catch {
    return "/";
  }
}

export default function Navbar() {
  const [pathname, setPathname] = React.useState(getPathname());

  React.useEffect(() => {
    const onPop = () => setPathname(getPathname());
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  const logout = () => {
    try {
      localStorage.removeItem("smartCampusUser");
    } catch {
      // ignore
    }
    try {
      window.history.pushState({}, "", "/login");
      window.dispatchEvent(new PopStateEvent("popstate"));
    } catch {
      window.location.pathname = "/login";
    }
  };

  const items = [
    { label: "Dashboard", to: "/dashboard", toSectionEvent: null },
    { label: "Tasks", to: "/dashboard", toSectionEvent: "tasks" },
    { label: "Notes", to: "/dashboard", toSectionEvent: "notes" },
    { label: "Goals", to: "/dashboard", toSectionEvent: "goals" },
    { label: "Progress", to: "/dashboard", toSectionEvent: "progress" },
  ];

  const scrollToSection = (sectionId) => {
    const el = document.getElementById(sectionId);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div className="nav">
      <div className="navInner">
        <div className="brand" aria-label="Smart Campus Learning Hub">
          <span className="brandDot" />
          <span>Smart Campus</span>
        </div>

        <div className="navLinks" role="navigation" aria-label="Primary navigation">
          {items.map((item) => {
            const isActive =
              pathname === item.to || (item.toSectionEvent === null && pathname === "/dashboard");

            const onClick = (e) => {
              e.preventDefault();

              try {
                window.history.pushState({}, "", item.to);
                window.dispatchEvent(new PopStateEvent("popstate"));
              } catch {
                window.location.pathname = item.to;
              }

              if (item.toSectionEvent) {
                setTimeout(() => scrollToSection(item.toSectionEvent), 0);
              }
            };

            return (
              <a
                key={item.label}
                href={item.to}
                onClick={onClick}
                style={{ ...navItemStyle(isActive), textDecoration: "none" }}
              >
                {item.label}
              </a>
            );
          })}

          <button
            type="button"
            onClick={logout}
            style={{
              marginLeft: 8,
              padding: "9px 12px",
              borderRadius: 10,
              border: "1px solid rgba(211,47,47,0.25)",
              background: "rgba(211,47,47,0.08)",
              color: "#b71c1c",
              fontWeight: 800,
              cursor: "pointer",
              transition: "transform 120ms ease, background 150ms ease",
            }}
          >
            Logout
          </button>

        </div>
      </div>
    </div>
  );
}

