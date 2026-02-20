
export class Terrain {
    constructor(name, baseColor, cost){
        this.name = name;
        this.baseColor = baseColor;
        this.cost = cost;
    }

    getColor(noiseValue, minThreshold, maxThreshold){
        let r = red(this.baseColor);
        let g = green(this.baseColor);
        let b = blue(this.baseColor);

        let variation = map(noiseValue, minThreshold, maxThreshold, 0.75, 1.25);

        return color(r * variation, g * variation, b * variation);
    }
}