import { useRef } from "react";
import { gameMedia } from "@/game/media";

export function MenuScenery() {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div ref={ref} className="menu-scenery" aria-hidden="true" onPointerMove={(event) => {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      const bounds = event.currentTarget.getBoundingClientRect();
      ref.current?.style.setProperty("--look-x", `${((event.clientX - bounds.left) / bounds.width - 0.5) * 28}px`);
      ref.current?.style.setProperty("--look-y", `${((event.clientY - bounds.top) / bounds.height - 0.5) * 12}px`);
    }} onPointerLeave={() => {
      ref.current?.style.setProperty("--look-x", "0px");
      ref.current?.style.setProperty("--look-y", "0px");
    }}>
      {[0, 1, 2].map((i) => <div key={i} className={`menu-depth menu-depth-${i}`}>
        <div className="menu-pan">
          {[0, 1, 2, 3].map((copy) => <img key={copy} src={gameMedia(`/game/maps/glades/bg${i}.png`)} alt="" draggable={false} />)}
        </div>
      </div>)}
      <div className="menu-ground" />
      <div className="title-shade" />
    </div>
  );
}