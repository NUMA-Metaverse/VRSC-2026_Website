import { About } from "@/components/About";
import { Archive } from "@/components/Archive";
import { Footer } from "@/components/Footer";
import { GuestLecture } from "@/components/GuestLecture";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PhotoStrip } from "@/components/PhotoStrip";
import { archivePhotos, preGuestPhotos } from "@/data/activityPhotos";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <PhotoStrip photos={preGuestPhotos} label="ゲスト講演前の活動写真" direction="left" />
        <GuestLecture />
        <PhotoStrip
          photos={archivePhotos}
          label="過去の開催前の活動写真"
          direction="right"
        />
        <Archive />
      </main>
      <Footer />
    </>
  );
}
