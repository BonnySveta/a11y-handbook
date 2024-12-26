import { useState, useCallback } from 'react';
import { SpotlightPosition, ElementDetails, VirtualNode } from '../types';
import { getElementInfo } from '../utils';
import { speechService } from '../../../services/speech';

export function useSpotlight() {
  const [spotlightPosition, setSpotlightPosition] = useState<SpotlightPosition>({
    top: 0, left: 0, width: 0, height: 0
  });
  const [elementInfo, setElementInfo] = useState<ElementDetails | null>(null);

  const getElementBounds = useCallback((element: Element) => {
    const rect = element.getBoundingClientRect();
    const padding = 8;

    const formGroup = element.closest('.sc-edmcci');
    
    let bounds;
    if (formGroup) {
      const groupRect = formGroup.getBoundingClientRect();
      bounds = {
        left: groupRect.left - padding,
        top: groupRect.top - padding,
        width: groupRect.width + (padding * 2),
        height: groupRect.height + (padding * 2)
      };
    } else {
      bounds = {
        left: rect.left - padding,
        top: rect.top - padding,
        width: rect.width + (padding * 2),
        height: rect.height + (padding * 2)
      };
    }

    return bounds;
  }, []);

  const updateVisualFocus = useCallback((node: VirtualNode) => {
    const element = node.element;
    const position = getElementBounds(element);
    
    setSpotlightPosition(position);
    
    const info = getElementInfo(element);
    setElementInfo(info);

    if (info.screenReaderText) {
      const [screenReaderText] = info.screenReaderText.split('\n');
      if (screenReaderText) {
        speechService.speak(screenReaderText);
      }
    }

    if (info.isFocusable && element instanceof HTMLElement) {
      element.focus();
    }
  }, [getElementBounds]);

  return {
    spotlightPosition,
    elementInfo,
    updateVisualFocus
  };
} 