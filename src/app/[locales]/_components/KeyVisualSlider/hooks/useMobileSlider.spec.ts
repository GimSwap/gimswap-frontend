import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { useMobileSlider } from './useMobileSlider';

describe('useMobileSlider', () => {
  let containerElement: HTMLDivElement;
  let itemElement: HTMLDivElement;

  beforeEach(() => {
    containerElement = document.createElement('div');
    itemElement = document.createElement('div');
    document.body.appendChild(containerElement);
    containerElement.appendChild(itemElement);

    Object.defineProperty(itemElement, 'clientWidth', { value: 300 });

    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.removeChild(containerElement);
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('초기 상태를 올바르게 설정해야 합니다', () => {
    const { result } = renderHook(() =>
      useMobileSlider({
        itemCount: 5,
        initialAutoplay: false,
      }),
    );

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.isAnimating).toBe(false);
    expect(result.current.isDragging).toBe(false);
    expect(result.current.autoplay).toBe(false);
  });

  it('handleNext 함수가 다음 슬라이드로 이동해야 합니다', async () => {
    const { result } = renderHook(() =>
      useMobileSlider({
        itemCount: 5,
        initialAutoplay: false,
      }),
    );

    act(() => {
      result.current.handleNext();
    });

    expect(result.current.isAnimating).toBe(true);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.currentIndex).toBe(1);
    expect(result.current.isAnimating).toBe(false);
  });

  it('handlePrev 함수가 이전 슬라이드로 이동해야 합니다', () => {
    const { result } = renderHook(() =>
      useMobileSlider({
        itemCount: 5,
        initialAutoplay: false,
      }),
    );

    act(() => {
      result.current.handleNext();
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.currentIndex).toBe(1);

    act(() => {
      result.current.handlePrev();
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.currentIndex).toBe(0);
  });

  it('첫 번째 슬라이드에서 handlePrev를 호출하면 마지막 슬라이드로 이동해야 합니다', () => {
    const itemCount = 5;
    const { result } = renderHook(() =>
      useMobileSlider({
        itemCount,
        initialAutoplay: false,
      }),
    );

    act(() => {
      result.current.handlePrev();
    });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.currentIndex).toBe(itemCount - 1);
  });

  it('toggleAutoplay 함수가 autoplay 상태를 토글해야 합니다', () => {
    const { result } = renderHook(() =>
      useMobileSlider({
        itemCount: 5,
        initialAutoplay: false,
      }),
    );

    expect(result.current.autoplay).toBe(false);

    act(() => {
      result.current.toggleAutoplay();
    });

    expect(result.current.autoplay).toBe(true);

    act(() => {
      result.current.toggleAutoplay();
    });

    expect(result.current.autoplay).toBe(false);
  });

  it('autoplay가 true일 때 자동으로 다음 슬라이드로 이동해야 합니다', () => {
    const autoplayInterval = 1000;
    const { result } = renderHook(() =>
      useMobileSlider({
        itemCount: 5,
        autoplayInterval,
        initialAutoplay: true,
      }),
    );

    expect(result.current.currentIndex).toBe(0);

    act(() => {
      vi.advanceTimersByTime(autoplayInterval);
    });

    expect(result.current.isAnimating).toBe(true);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.currentIndex).toBe(1);
  });

  it('드래그 시작, 드래그 종료, 드래그 취소 함수가 올바르게 작동해야 합니다', () => {
    const { result } = renderHook(() =>
      useMobileSlider({
        itemCount: 5,
        initialAutoplay: false,
      }),
    );

    act(() => {
      result.current.handleDragStart({
        clientX: 100,
      } as React.MouseEvent);
    });

    expect(result.current.isDragging).toBe(true);

    act(() => {
      result.current.handleDragEnd({
        clientX: 150,
      } as React.MouseEvent);
    });

    expect(result.current.isDragging).toBe(false);

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(result.current.currentIndex).toBe(4);

    act(() => {
      result.current.handleDragStart({
        clientX: 100,
      } as React.MouseEvent);
    });

    act(() => {
      result.current.handleDragCancel();
    });

    expect(result.current.isDragging).toBe(false);
  });

  it('getItemClass 함수가 올바른 클래스를 반환해야 합니다', () => {
    const { result } = renderHook(() =>
      useMobileSlider({
        itemCount: 5,
        initialAutoplay: false,
      }),
    );

    const currentClass = result.current.getItemClass('current');
    expect(currentClass).toContain('scale-100');
    expect(currentClass).toContain('opacity-100');
    expect(currentClass).not.toContain('animate-');

    act(() => {
      result.current.handleNext();
    });

    const animatingClass = result.current.getItemClass('current');
    expect(animatingClass).toContain('scale-100');
    expect(animatingClass).toContain('animate-slide-left-center');
  });
});
