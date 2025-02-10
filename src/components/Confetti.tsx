// confetti.tsx
import React, {
    forwardRef,
    useCallback,
    useEffect,
    useImperativeHandle,
    useMemo,
    useRef,
    useState
  } from "react";
  import type { ReactNode } from "react";
  import confetti from "canvas-confetti";
  import type {
    GlobalOptions,
    CreateTypes as ConfettiInstance,
    Options as ConfettiOptions,
  } from "canvas-confetti";
  
  type Api = {
    fire: (options?: ConfettiOptions) => void;
  };
  
  type Props = React.ComponentPropsWithRef<"canvas"> & {
    options?: ConfettiOptions;
    globalOptions?: GlobalOptions;
    manualStart?: boolean;
    children?: ReactNode;
  };
  
  export type ConfettiRef = Api | null;
  
  const Confetti = forwardRef<ConfettiRef, Props>((props, ref) => {
    const {
      options = {
        particleCount: 80,
        spread: 80,
        origin: { y: 0.6 },
        colors: [
          '#FF0000', // Rood
          '#00FF00', // Groen
          '#0000FF', // Blauw
          '#FFFF00', // Geel
          '#FF00FF', // Magenta
          '#00FFFF', // Cyaan
          '#FFFFFF'  // Wit
        ],
        gravity: 0.3,
        ticks: 300,
        scalar: 1.2,    // Iets grotere confetti
        shapes: ['square'], // Verschillende vormen
        disableForReducedMotion: true // Toegankelijkheid
      },
      globalOptions = { resize: true, useWorker: true },
      manualStart = false,
      children,
      ...rest
    } = props;
    const instanceRef = useRef<ConfettiInstance | null>(null);
  
    const canvasRef = useCallback((node: HTMLCanvasElement | null) => {
      if (node !== null) {
        instanceRef.current?.reset();
        instanceRef.current = confetti.create(node, globalOptions);
      } else {
        instanceRef.current?.reset();
        instanceRef.current = null;
      }
    }, [globalOptions]);
  
    const fire = useCallback(
      (opts: ConfettiOptions = {}) => {
        console.log('Firing confetti with colors:', options.colors); // Debug log
        return instanceRef.current?.({ ...options, ...opts });
      },
      [options]
    );
  
    const api = useMemo(() => ({ fire }), [fire]);
  
    useImperativeHandle(ref, () => api, [api]);
  
    useEffect(() => {
      if (!manualStart) {
        fire();
      }
    }, [manualStart, fire]);
  
    return (
      <>
        <canvas 
          ref={canvasRef} 
          {...rest} 
          style={{ 
            position: 'absolute',
            pointerEvents: 'none',
            width: '100%',
            height: '100%',
            top: 0,
            left: 0,
            ...rest.style,
          }}
        />
        {children}
      </>
    );
  });
  
  Confetti.displayName = "Confetti";
  
  export { Confetti };
  