const kSpeed=128;
const timeLeft = Symbol('AITimeLeft');
const nextDirection = Symbol('AINextDirection');

export default function random(go, delta, minDelay=.25, maxDelay=1.25, minSpeed=kSpeed, maxSpeed=kSpeed) {
    if ((go[timeLeft] = (go[timeLeft] || 0) - delta) < 0) {
        go[timeLeft] = Phaser.Math.Between(minDelay, maxDelay);
        go[nextDirection] = Phaser.Math.RandomXY(
            go[nextDirection] || new Phaser.Math.Vector2(),
            Phaser.Math.Between(minSpeed, maxSpeed)
        );
    }
    go.walkAlong(go[nextDirection]);
}
