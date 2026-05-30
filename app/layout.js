export const metadata = {
  title: 'Amazon Top Sellers Tracker',
  description: 'Daily Amazon bestseller report — ZIP 10019, NYC',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
