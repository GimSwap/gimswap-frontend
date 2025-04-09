// 디바운스 유틸리티 함수
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number,
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function updateAnimationStyles(containerWidth: number) {
  const existingStyle = document.getElementById('carousel-keyframes');
  if (existingStyle) {
    existingStyle.remove();
  }

  const styleEl = document.createElement('style');
  styleEl.id = 'carousel-keyframes';
  styleEl.textContent = `
    /* 다음 슬라이드로 이동 (왼쪽으로 이동) */
    @keyframes slideLeft {
      from {
        transform: translateX(0) translateY(16px);
      }
      to {
        transform: translateX(-${containerWidth}px) translateY(-16px) scale(0.9);
        opacity: 0.5;
      }
    }

    /* 이전 슬라이드로 이동 (오른쪽으로 이동) */
    @keyframes slideRight {
      from {
        transform: translateX(0) translateY(16px);
      }
      to {
        transform: translateX(${containerWidth}px) translateY(-16px) scale(0.9);
        opacity: 0.5;
      }
    }

    /* 왼쪽에서 중앙으로 이동 */
    @keyframes slideLeftSide {
      from {
        transform: translateX(0) translateY(-16px) scale(0.9);
        opacity: 0.5;
      }
      to {
        transform: translateX(-${containerWidth}px) translateY(16px) scale(1);
        opacity: 1;
      }
    }

    /* 오른쪽에서 중앙으로 이동 */
    @keyframes slideRightSide {
      from {
        transform: translateX(0) translateY(-16px) scale(0.9);
        opacity: 0.5;
      }
      to {
        transform: translateX(${containerWidth}px) translateY(16px) scale(1);
        opacity: 1;
      }
    }

    /* 새로 추가: 왼쪽 끝에서 나타나는 애니메이션 */
    @keyframes appearFromLeft {
      from {
        transform: translateX(-150%) scale(0.9);
        opacity: 0;
      }
      to {
        transform: translateX(0) translateY(-16px) scale(0.9);
        opacity: 0.5;
      }
    }

    /* 새로 추가: 오른쪽으로 사라지는 애니메이션 */
    @keyframes disappearToRight {
      from {
        transform: translateX(0) translateY(-16px) scale(0.9);
        opacity: 0.5;
      }
      to {
        transform: translateX(150%) scale(0.9);
        opacity: 0;
      }
    }

    /* 새로 추가: 오른쪽 끝에서 나타나는 애니메이션 */
    @keyframes appearFromRight {
      from {
        transform: translateX(150%) scale(0.9);
        opacity: 0;
      }
      to {
        transform: translateX(0) translateY(-16px) scale(0.9);
        opacity: 0.5;
      }
    }

    /* 새로 추가: 왼쪽으로 사라지는 애니메이션 */
    @keyframes disappearToLeft {
      from {
        transform: translateX(0) translateY(-16px) scale(0.9);
        opacity: 0.5;
      }
      to {
        transform: translateX(-150%) scale(0.9);
        opacity: 0;
      }
    }

    .animate-slide-left-center {
      animation: slideLeft 0.5s ease-in-out forwards;
      will-change: transform, opacity;
    }

    .animate-slide-right-center {
      animation: slideRight 0.5s ease-in-out forwards;
      will-change: transform, opacity;
    }

    .animate-slide-left-side {
      animation: slideLeftSide 0.5s ease-in-out forwards;
      will-change: transform, opacity;
    }

    .animate-slide-right-side {
      animation: slideRightSide 0.5s ease-in-out forwards;
      will-change: transform, opacity;
    }

    .animate-appear-from-left {
      animation: appearFromLeft 0.5s ease-in-out forwards;
      will-change: transform, opacity;
    }

    .animate-disappear-to-right {
      animation: disappearToRight 0.5s ease-in-out forwards;
      will-change: transform, opacity;
    }

    .animate-appear-from-right {
      animation: appearFromRight 0.5s ease-in-out forwards;
      will-change: transform, opacity;
    }

    .animate-disappear-to-left {
      animation: disappearToLeft 0.5s ease-in-out forwards;
      will-change: transform, opacity;
    }
  `;

  document.head.appendChild(styleEl);
}
