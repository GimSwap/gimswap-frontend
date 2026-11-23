import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { useDesktopSlider } from './useDesktopSlider';

const mockItems = [
  {
    title: '테스트 슬라이드 1',
    description: '설명 1',
    buttonText: '버튼 1',
    href: '/link1',
  },
  {
    title: '테스트 슬라이드 2',
    description: '설명 2',
    buttonText: '버튼 2',
    href: '/link2',
  },
  {
    title: '테스트 슬라이드 3',
    description: '설명 3',
    buttonText: '버튼 3',
    href: '/link3',
  },
];

describe('useDesktopSlider', () => {
  let parentElement: HTMLDivElement;
  let sliderElement: HTMLDivElement;

  beforeEach(() => {
    parentElement = document.createElement('div') as HTMLDivElement;
    sliderElement = document.createElement('div') as HTMLDivElement;

    parentElement.style.width = '1000px';
    parentElement.appendChild(sliderElement);

    vi.spyOn(HTMLElement.prototype, 'offsetWidth', 'get').mockReturnValue(1000);
  });

  it('초기 상태 설정 확인', () => {
    const { result } = renderHook(() => useDesktopSlider({ items: mockItems }));

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.totalItems).toBe(mockItems.length);
    expect(result.current.isFirst).toBe(true);
    expect(result.current.isLast).toBe(false);
    expect(result.current.visibleItems).toEqual([mockItems[0]]);
  });

  it('goToNext 인덱스 증가 확인', () => {
    const { result } = renderHook(() => useDesktopSlider({ items: mockItems }));

    act(() => {
      result.current.goToNext();
    });

    expect(result.current.currentIndex).toBe(1);
    expect(result.current.visibleItems).toEqual([mockItems[1]]);
    expect(result.current.isFirst).toBe(false);
    expect(result.current.isLast).toBe(false);
  });

  it('goToPrev 인덱스 감소 확인', () => {
    const { result } = renderHook(() =>
      useDesktopSlider({ items: mockItems, loop: true }),
    );

    act(() => {
      result.current.goToNext();
    });

    expect(result.current.currentIndex).toBe(1);

    act(() => {
      result.current.goToPrev();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.isFirst).toBe(true);
  });

  it('goToIndex 인덱스 지정 확인', () => {
    const { result } = renderHook(() => useDesktopSlider({ items: mockItems }));

    act(() => {
      result.current.goToIndex(2);
    });

    expect(result.current.currentIndex).toBe(2);
    expect(result.current.visibleItems).toEqual([mockItems[2]]);
    expect(result.current.isLast).toBe(true);
  });

  it('loop가 true일 때 마지막 슬라이드에서 다음으로 넘어가면 첫 슬라이드로 이동 확인', () => {
    const { result } = renderHook(() =>
      useDesktopSlider({ items: mockItems, loop: true }),
    );

    act(() => {
      result.current.goToIndex(mockItems.length - 1);
    });

    expect(result.current.currentIndex).toBe(mockItems.length - 1);

    act(() => {
      result.current.goToNext();
    });

    expect(result.current.currentIndex).toBe(0);
    expect(result.current.isFirst).toBe(true);
  });

  it('loop가 false일 때 마지막 슬라이드에서 다음으로 넘어가려고 해도 변경되지 않아야 합니다', () => {
    const { result } = renderHook(() =>
      useDesktopSlider({ items: mockItems, loop: false }),
    );

    act(() => {
      result.current.goToIndex(mockItems.length - 1);
    });

    expect(result.current.currentIndex).toBe(mockItems.length - 1);

    act(() => {
      result.current.goToNext();
    });

    expect(result.current.currentIndex).toBe(mockItems.length - 1);
    expect(result.current.isLast).toBe(true);
  });

  it('getSliderStyles와 getSlideItemStyles가 올바른 스타일을 반환해야 합니다', () => {
    const { result } = renderHook(() =>
      useDesktopSlider({
        items: mockItems,
        slideAnimationDuration: 500,
      }),
    );

    const sliderStyles = result.current.getSliderStyles();
    const slideItemStyles = result.current.getSlideItemStyles();

    expect(sliderStyles).toEqual({
      display: 'flex',
      width: `${mockItems.length * 100}%`,
      transition: 'transform 500ms ease-in-out',
    });

    expect(slideItemStyles).toEqual({
      width: `${100 / mockItems.length}%`,
    });
  });
});
