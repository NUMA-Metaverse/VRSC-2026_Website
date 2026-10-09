import { Picture } from "./ui/Picture";
import type { ActivityPhoto } from "@/data/activityPhotos";

export function PhotoStrip({ photos, label, direction = "left", eager = false }: {
  photos: readonly ActivityPhoto[];
  label: string;
  direction?: "left" | "right";
  // 最初の画面に映る帯だけ、すぐに読み込む。ほかは近づいてから読み込む。
  eager?: boolean;
}) {
  return (
    <div className="photo-strip" aria-label={label}>
      <div className="photo-viewport" tabIndex={0} role="region" aria-label={`${label}。横に流れる活動写真です。`}>
        <div className="photo-track" data-direction={direction} style={{ animationDuration: `${photos.length * 8}s` }}>
          {[false, true].map((duplicate) => (
            <div className="photo-set" aria-hidden={duplicate || undefined} key={String(duplicate)}>
              {photos.map((photo) => (
                <div className="strip-photo" key={photo.file}>
                  <Picture
                    src={`/images/${photo.file}.webp`}
                    alt={duplicate ? "" : photo.alt}
                    fill
                    sizes="(max-width: 900px) 200px, (max-width: 1636px) 22vw, 360px"
                    loading={eager ? "eager" : "lazy"}
                  />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
