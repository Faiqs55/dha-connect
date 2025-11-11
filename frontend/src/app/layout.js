import "./globals.css";


export const metadata = {
  title: "DHA - CONNECT",
  description: "Find Properties in DHA Lahore. Real Data. Real Brokers. Real Properties",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
      >
        {children}
      </body>
    </html>
  );
}
