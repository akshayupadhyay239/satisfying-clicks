const widgets = [
  {
    name: "Bubble Wrap Popper",
    description: "Pop endless bubbles!",
    icon: "\u{1F4A5}",
    comingSoon: false,
  },
  {
    name: "Switches & Dials",
    description: "Click, clack, and spin!",
    icon: "\u{1F39B}",
    comingSoon: true,
  },
  {
    name: "Fidget Buttons",
    description: "Press for tingles!",
    icon: "\u{1F534}",
    comingSoon: true,
  },
];

interface HomeProps {
  onOpenBubbleWrap: () => void;
}

export default function Home({ onOpenBubbleWrap }: HomeProps) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ backgroundColor: "#008080" }}
    >
      <div className="win95-window w-full max-w-lg">
        {/* Title bar */}
        <div className="win95-titlebar">
          <span>Satisfying Clicks</span>
          <div className="flex gap-0.5">
            <button className="win95-titlebar-btn">_</button>
            <button className="win95-titlebar-btn">
              <span style={{ fontSize: "8px" }}>&#9633;</span>
            </button>
            <button className="win95-titlebar-btn">X</button>
          </div>
        </div>

        {/* Menu bar */}
        <div className="px-1 py-0.5 text-xs" style={{ backgroundColor: "#c0c0c0", borderBottom: "1px solid #808080" }}>
          <span className="px-1 hover:bg-[#000080] hover:text-white cursor-default">File</span>
          <span className="px-1 hover:bg-[#000080] hover:text-white cursor-default">Edit</span>
          <span className="px-1 hover:bg-[#000080] hover:text-white cursor-default">View</span>
          <span className="px-1 hover:bg-[#000080] hover:text-white cursor-default">Help</span>
        </div>

        {/* Content area */}
        <div className="p-4">
          <p className="text-xs mb-4" style={{ color: "#000000" }}>
            Play with endlessly satisfying widgets. Pop, click, spin, and tingle!
          </p>

          <div className="flex flex-col gap-3">
            {widgets.map((widget) =>
              widget.name === "Bubble Wrap Popper" && !widget.comingSoon ? (
                <button
                  key={widget.name}
                  className="win95-button flex items-center gap-3 text-left p-3!"
                  onClick={onOpenBubbleWrap}
                  style={{ minHeight: 60 }}
                >
                  <span className="text-2xl">{widget.icon}</span>
                  <div>
                    <div className="font-bold text-sm" style={{ color: "#000000" }}>
                      {widget.name}
                    </div>
                    <div className="text-xs" style={{ color: "#404040" }}>
                      {widget.description}
                    </div>
                  </div>
                </button>
              ) : (
                <div
                  key={widget.name}
                  className="win95-inset flex items-center gap-3 p-3 opacity-60"
                  style={{ backgroundColor: "#c0c0c0" }}
                >
                  <span className="text-2xl grayscale">{widget.icon}</span>
                  <div>
                    <div className="font-bold text-sm" style={{ color: "#808080" }}>
                      {widget.name}
                    </div>
                    <div className="text-xs" style={{ color: "#808080" }}>
                      {widget.description}
                    </div>
                    <span
                      className="text-[10px] px-1 inline-block mt-0.5"
                      style={{
                        backgroundColor: "#c0c0c0",
                        border: "1px solid #808080",
                        color: "#404040",
                      }}
                    >
                      Coming Soon
                    </span>
                  </div>
                </div>
              )
            )}
          </div>
        </div>

        {/* Status bar */}
        <div className="win95-inset mx-1 mb-1 px-2 py-0.5 text-[11px]" style={{ color: "#000000" }}>
          3 widgets | 1 available
        </div>
      </div>
    </div>
  );
}
