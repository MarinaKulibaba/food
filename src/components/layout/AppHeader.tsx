type AppHeaderProps = {
  brand?: string;
  tagline?: string;
};

export function AppHeader({
  brand = "fooD",
  tagline = "What’s in your kitchen becomes dinner.",
}: AppHeaderProps) {
  return (
    <header className="app-header">
      <div className="app-header__inner">
        <p className="app-header__brand">{brand}</p>
        <p className="app-header__tagline">{tagline}</p>
      </div>
    </header>
  );
}
