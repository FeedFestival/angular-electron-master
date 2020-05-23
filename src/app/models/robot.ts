
export interface IRobot {
    setKeyboardDelay(ms: number): void
    keyTap(key: string, modifier?: string | string[]): void
    keyToggle(key: string, down: string, modifier?: string | string[]): void
    unicodeTap(value: number): void
    typeString(string: string): void
    typeStringDelayed(string: string, cpm: number): void
    setMouseDelay(delay: number): void
    updateScreenMetrics(): void
    moveMouse(x: number, y: number): void
    moveMouseSmooth(x: number, y: number, speed?: number): void
    mouseClick(button?: string, double?: boolean): void
    mouseToggle(down?: string, button?: string): void
    dragMouse(x: number, y: number): void
    scrollMouse(x: number, y: number): void
    getMousePos(): { x: number, y: number }
    getPixelColor(x: number, y: number): string
    getScreenSize(): { width: number, height: number }
}