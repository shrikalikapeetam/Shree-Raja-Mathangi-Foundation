import { getLayout } from "@/prismicio";
import { getDonationContent } from "@/lib/donation-content";
import DonationModal from "@/components/DonationModal";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
export default async function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const layout = await getLayout();
  return (
    <>
      <Header />
      {children}
      <Footer />
      {layout && <DonationModal content={getDonationContent(layout.data)} />}
    </>
  );
}
