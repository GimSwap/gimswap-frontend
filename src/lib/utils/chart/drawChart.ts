import {
  calculateBarPositions,
  calculateRatio,
  calculateTicks,
} from './_utils/calculateChart';
import {
  BAR_PADDING,
  BAR_WIDTH,
  BOTTOM_GAP,
  CURRENT_BAR_WIDTH,
  LABEL_STEP,
  UPSCALE_RATIO,
} from './_constants/chartConstants';
import { insertComma } from '../insertComma';
import { safeCalc } from '../safeCalc';
import { usdtTickToKrw } from '../calcTick';

interface DrawChartProps {
  liquidities: string[];
  minTick: number;
  tickSpacing: number;
  canvas: HTMLCanvasElement;
  parent: HTMLDivElement;
  selectedMinTick: number;
  selectedMaxTick: number;
  currentPrice: number;
  disableBarColor?: string;
  activeBarColor?: string;
  currentPriceColor?: string;
}

export class DrawChart {
  private disableBarColor: string;
  private activeBarColor: string;
  private currentPriceColor: string;
  private ticks: number[];

  constructor({
    liquidities,
    minTick,
    tickSpacing,
    canvas,
    parent,
    selectedMinTick,
    selectedMaxTick,
    currentPrice,
    disableBarColor = '#D9D9D9',
    activeBarColor = '#CDBBFF',
    currentPriceColor = '#926CFF',
  }: DrawChartProps) {
    this.disableBarColor = disableBarColor;
    this.activeBarColor = activeBarColor;
    this.currentPriceColor = currentPriceColor;

    this.ticks = calculateTicks(minTick, tickSpacing, liquidities.length);

    this.resizeCanvas(canvas, parent);

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas context');

    this.draw(
      ctx,
      selectedMinTick,
      selectedMaxTick,
      currentPrice,

      liquidities,
      this.ticks,
    );
  }

  resizeCanvas(canvas: HTMLCanvasElement, parent: HTMLDivElement) {
    const parentWidth = parent.clientWidth;
    const parentHeight = parent.clientHeight;

    canvas.style.width = `${parentWidth}px`;
    canvas.style.height = `${parentHeight + BOTTOM_GAP}px`;
    canvas.height = (parentHeight + BOTTOM_GAP) * UPSCALE_RATIO;
    canvas.width = parentWidth * UPSCALE_RATIO;
  }

  draw(
    ctx: CanvasRenderingContext2D,
    selectedMinTick: number,
    selectedMaxTick: number,
    currentPrice: number,
    liquidities: string[],
    ticks: number[],
  ) {
    const minLiquidity = safeCalc.min(liquidities).toFixed();
    const maxLiquidity = safeCalc.max(liquidities).toFixed();

    const { width, height } = ctx.canvas;

    const { barPositions, activeMinX, activeMaxX } = calculateBarPositions(
      liquidities,
      width,
      minLiquidity,
      maxLiquidity,
      height - BOTTOM_GAP,
      usdtTickToKrw(selectedMinTick),
      usdtTickToKrw(selectedMaxTick),
      ticks,
      this.activeBarColor,
      this.disableBarColor,
    );

    ctx.save();
    this.drawBars(ctx, barPositions, ticks);
    this.drawRange(
      ctx,
      currentPrice,
      activeMinX,
      activeMaxX,
      ticks,
      selectedMinTick,
      selectedMaxTick,
    );
    ctx.restore();
  }

  updateChart(
    ctx: CanvasRenderingContext2D,
    selectedMinTick: number,
    selectedMaxTick: number,
    currentPrice: number,
    liquidities: string[],
  ) {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    this.draw(
      ctx,
      selectedMinTick,
      selectedMaxTick,
      currentPrice,
      liquidities,
      this.ticks,
    );
  }

  drawBars(
    ctx: CanvasRenderingContext2D,
    barPositions: { x: number; height: string; color: string }[],
    ticks: number[],
  ) {
    barPositions.forEach((barPosition) => {
      const barX = barPosition.x;
      const barHeight = +barPosition.height;
      const barY = ctx.canvas.height - BOTTOM_GAP - +barHeight;
      const radius = BAR_WIDTH / 2;
      if (barHeight > 0) {
        ctx.fillStyle = barPosition.color;
        ctx.fillRect(barX, barY + radius, BAR_WIDTH, barHeight - radius);
        ctx.beginPath();
        ctx.arc(barX + radius, barY + radius + 1, radius, Math.PI, 0);
        ctx.fill();
        ctx.closePath();
      }
    });
    this.drawTickLabels(ctx, ticks, barPositions);
  }

  drawRange(
    ctx: CanvasRenderingContext2D,
    currentPrice: number,
    activeMinX: number,
    activeMaxX: number,
    ticks: number[],
    selectedMinTick: number,
    selectedMaxTick: number,
  ) {
    const { width, height: _height } = ctx.canvas;

    const height = _height - BOTTOM_GAP;
    const minTick = ticks[0];
    const maxTick = ticks[ticks.length - 1];

    const actvieMinXIndex = ticks.findIndex(
      (tick) =>
        Math.floor(tick) === Math.floor(+usdtTickToKrw(selectedMinTick)),
    );

    const actvieMaxXIndex = ticks.findIndex(
      (tick) =>
        Math.floor(tick) === Math.floor(+usdtTickToKrw(selectedMaxTick)),
    );

    const isCurrentPriceInFirstBar =
      currentPrice >= +usdtTickToKrw(selectedMinTick) &&
      currentPrice <= ticks[actvieMinXIndex + 1];
    const isCurrentPriceInLastBar =
      currentPrice >= ticks[actvieMaxXIndex - 1] &&
      currentPrice <= +usdtTickToKrw(selectedMaxTick);

    const CORRECTION_X = 15;

    const getCurrentPriceX = () => {
      if (isCurrentPriceInFirstBar) {
        const difference = Math.min(
          currentPrice - +usdtTickToKrw(selectedMinTick),
          6.1,
        );
        const _correction = (CORRECTION_X / 6) * difference;
        return activeMinX + _correction;
      }

      if (isCurrentPriceInLastBar) {
        const difference = Math.min(
          +usdtTickToKrw(selectedMaxTick) - currentPrice,
          6.1,
        );
        const _correction = CORRECTION_X - (CORRECTION_X / 6) * difference;
        return activeMaxX + _correction;
      }

      return (
        calculateRatio(currentPrice, minTick, maxTick) * width +
        CURRENT_BAR_WIDTH * 2 +
        2
      );
    };

    const currentPriceX = getCurrentPriceX();

    ctx.beginPath();
    ctx.fillStyle = this.currentPriceColor;
    ctx.fillRect(currentPriceX, 20, CURRENT_BAR_WIDTH, height - 20);
    ctx.fill();
    ctx.closePath();

    const shapeWidth = 26 * 2;
    const shapeHeight = 14 * 2;

    ctx.beginPath();
    ctx.fillStyle = this.currentPriceColor;
    ctx.roundRect(
      currentPriceX - shapeWidth / 2 + 2,
      0,
      shapeWidth,
      shapeHeight,
      15,
    );
    ctx.fill();
    ctx.closePath();

    ctx.font = '16px Pretendard';
    ctx.fillStyle = '#fff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(
      insertComma(Math.floor(currentPrice).toString()),
      currentPriceX + 2,
      shapeHeight / 2 + 2,
    );

    ctx.fillStyle = this.currentPriceColor;
    ctx.globalAlpha = 0.05;
    ctx.fillRect(activeMinX, 0, activeMaxX - activeMinX + BAR_WIDTH, height);
    ctx.globalAlpha = 1;
  }

  drawTickLabels(
    ctx: CanvasRenderingContext2D,
    ticks: number[],
    barPositions: { x: number }[],
  ) {
    const { height } = ctx.canvas;

    ctx.font = '20px Arial';
    ctx.fillStyle = this.disableBarColor;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';

    const numBars = Math.min(barPositions.length, ticks.length - 1);

    for (let i = 0; i < numBars; i++) {
      const currentTick = ticks[i];
      const nextTick = ticks[i + 1];

      const currentX = barPositions[i].x;
      const nextX =
        i + 1 < barPositions.length ? barPositions[i + 1].x : currentX;

      for (
        let value = Math.ceil(currentTick / 10) * 10;
        value < nextTick;
        value += LABEL_STEP
      ) {
        const ratio = (value - currentTick) / (nextTick - currentTick);
        const x = currentX + ratio * (nextX - currentX) + BAR_PADDING - 20;
        ctx.fillText(value.toFixed(0), x, height);
      }
    }
  }
}
