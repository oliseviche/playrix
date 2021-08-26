// Minor helper function resized here
// Not much of them thankfully

export function getRandomValue(min:number, max:number): number {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min)) + min;
}

export function FPSMeter(placeholder: HTMLElement | null) {
    let frames = 0;
    let last = 0;
    let ellapsed = 0;
    let fps = 0;

    return {
        measure(time: number) {
            frames++;
            ellapsed += time - (last || time);
            if (ellapsed >= 1000) {
                fps = frames;
                frames = ellapsed = 0;
            }
            last = time;
        },
        show() {
            setTimeout(() => {
                if (placeholder) {
                    placeholder.innerText = fps + 'fps';
                }
                this.show();
            }, 1000)
        }
    }
}