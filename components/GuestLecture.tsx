import Image from "next/image";
import { publicAsset } from "@/lib/site";
import { MotionReveal } from "./ui/MotionReveal";

export function GuestLecture() {
  return (
    <section
      className="guest section-space"
      id="guest"
      aria-labelledby="guest-title"
    >
      <div className="page-container">
        <MotionReveal className="guest-heading">
          <h2 id="guest-title">ゲスト講演</h2>
        </MotionReveal>
        <div className="guest-layout">
          <MotionReveal className="guest-portrait" effect="photo">
            <figure>
              <Image
                src={publicAsset("/guest/orange.webp")}
                alt="オレンジのプロフィール写真"
                width={1200}
                height={800}
                sizes="(max-width: 760px) calc(100vw - 60px), 440px"
              />
              <figcaption>
                <p className="guest-role">VRクリエイター</p>
                <h3>オレンジ</h3>
              </figcaption>
            </figure>
          </MotionReveal>
          <MotionReveal className="guest-profile" delay={0.12}>
            <p>
              「お楽しみが2倍!!」をモットーにVRならではの遊びや体験を生み出すVRクリエイター。『ピピピ技研』というブランドで、VRChatやResoniteを中心にインタラクティブなギミックやゲーム、VRライブなど幅広いコンテンツを制作している。
            </p>
            <p>
              代表作には、VR空間での撮影体験を拡張する『ImmersCam
              180』をはじめ、『おでかけAR』『デリシャスカメラ』などがある。また、Sanrio
              Virtual
              Festivalではプレイアブル・ライブの制作を手がけ、VketRealではリアル会場とVR空間をつなぐ連動コンテンツ『Vマド』を制作するなど、バーチャルとリアルを横断した体験づくりにも取り組んでいる。
            </p>
            <p>
              便利なツールやシステムの開発から、触って楽しい・見て楽しいインタラクションを取り入れたプレイアブルコンテンツやライブ体験の制作までを一貫して手がける。システム設計とビジュアル・演出を密接に連携させ、企画から実装、体験設計までを横断して形にできる総合的な制作力を強みとしている。
            </p>
            <p>
              技術そのものを目的とするのではなく、「触った人のお楽しみが2倍になる」体験を目指し、VRだからこそ実現できる新しい遊びやエンターテインメントを追求している。
            </p>
          </MotionReveal>
        </div>
      </div>
    </section>
  );
}
