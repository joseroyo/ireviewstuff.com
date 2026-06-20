"use client"

import { useRef, ReactNode } from "react";
import Draggable from "react-draggable";

type WindowProps = {
  title?: string;
  children: ReactNode;
  onClose?: () => void;
  className?: string;
  draggable?: boolean;
};

type WindowButtonProps = {
  label: string;
  symbol: string;
  onClick?: () => void;
};

function WindowButton({ label, symbol, onClick }: WindowButtonProps) {
    return (
        <button
        type="button"
        onClick={onClick}
        aria-label={label}
        className="w-5 h-5 flex items-center justify-center text-xs border bg-window-bg hover:bg-white transition-colors"
        >
            {symbol}
        </button>
    );
}

export default function Window({ title, children, onClose, className="", draggable = false }: WindowProps) {
    const base = "border-3 border-window-border-color rounded-md shadow-lg overflow-hidden bg-window-bg";
    const nodeRef = useRef<HTMLDivElement>(null);

    const windowCont = (
        <div className={`${base} ${className}`} ref={nodeRef}>
            <div className="window-titlebar cursor-move flex items-center justify-between px-2 py-1 border-b-3 border-window-border-color bg-window-dotted bg-size-[4px_4px]">
                {title && (<span className="font-bold text-[16px] px-[12px] pb-[2px] bg-window-bg border-1 rounded-[2px]">{title}</span>)}
                <div className="flex items-center grow justify-end gap-1">
                    <WindowButton label="minimize" symbol="–" />
                    <WindowButton label="maximize" symbol="□" />
                    <WindowButton label="close" symbol="✕" onClick={onClose} />
                </div>
            </div>
            <div className="m-[6px] p-[12px] border-2 border-window-border-color shadow-inner-soft">
                {children}
            </div>
        </div>
    );

    if (!draggable) return windowCont;

    return (
    <Draggable handle=".window-titlebar" nodeRef={nodeRef}>
        {windowCont}
    </Draggable>
  );
}
