import { useEffect, useState } from "react";

export default function BearAnimation({ 
  currentFocus,
  emailLength 
}: { 
  currentFocus: "EMAIL" | "PASSWORD",
  emailLength: number
}) {
  const [hideBearImgs, setHideBearImgs] = useState<string[]>([]);
  const [watchBearImgs, setWatchBearImgs] = useState<string[]>([]);
  const [currentBearImg, setCurrentBearImg] = useState<string | null>(null);

  useEffect(() => {
    const loadImages = (glob: Record<string, { default: string }>, setState: (imgs: string[]) => void) => {
      setState(
        Object.values(glob)
          .map((asset) => asset.default)
          .sort((a, b) => {
            // Extract het getal uit de bestandsnaam en sorteer numeriek
            const numA = parseInt(a.match(/(\d+)/)?.[1] || "0", 10);
            const numB = parseInt(b.match(/(\d+)/)?.[1] || "0", 10);
            return numA - numB;
          })
      );
    };

    // @ts-ignore
    loadImages(import.meta.glob("../assets/img/watch_bear_*.png", { eager: true }), setWatchBearImgs);
    // @ts-ignore
    loadImages(import.meta.glob("../assets/img/hide_bear_*.png", { eager: true }), setHideBearImgs);
  }, []);

  useEffect(() => {
    if (currentFocus === "EMAIL" && watchBearImgs.length > 0) {
      const maxEmailLength = 30;
      const totalFrames = watchBearImgs.length;

      // **Fix:** Lineaire verdeling van frames in plaats van exponentiële sprongen
      const frameIndex = Math.min(
        Math.round((emailLength / maxEmailLength) * (totalFrames - 1)), 
        totalFrames - 1
      );

      setTimeout(() => {
      setCurrentBearImg(watchBearImgs[frameIndex]);
    }, 50); // Kleine vertraging voor smooth effect
    }
    else if (currentFocus === "PASSWORD") {
      hideBearImgs.forEach((img, index) => 
        setTimeout(() => setCurrentBearImg(img), index * 75)
      );
    }
  }, [currentFocus, hideBearImgs, watchBearImgs, emailLength]);

  return (
    <div className="flex justify-center mb-6">
      <img 
        src={currentBearImg ?? watchBearImgs[0]} 
        className="rounded-full" 
        width={130} 
        height={130} 
        alt="Animated bear"
        tabIndex={-1} 
      />
    </div>
  );
} 