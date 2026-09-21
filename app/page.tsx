import { About } from "@/components/About";
import { Archive } from "@/components/Archive";
import { EntryCTA } from "@/components/EntryCTA";
import { Footer } from "@/components/Footer";
import { GuestLecture } from "@/components/GuestLecture";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { PhotoStrip } from "@/components/PhotoStrip";
import { postEntryPhotos, preEntryPhotos, preGuestPhotos } from "@/data/activityPhotos";

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
          photos={preEntryPhotos}
          label="募集案内前の活動写真"
          direction="right"
        />
        <EntryCTA />
        <PhotoStrip photos={postEntryPhotos} label="募集案内後の活動写真" direction="left" />
        <Archive />
      </main>
      <Footer />
    </>
  );
}
