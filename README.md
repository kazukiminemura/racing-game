# F1 Racing Game 🏁

A mobile-friendly F1 racing game built with HTML5 Canvas and vanilla JavaScript.

## Features

- 📱 **Mobile Optimized** - Touch controls designed for smartphones
- 🎮 **Simple Controls** - Drag to steer, tap top to accelerate
- 🏁 **Lap Tracking** - Automatic lap counting
- ⚡ **Physics Engine** - Realistic speed, acceleration, and friction
- 💥 **Collision Detection** - Bounce back if you leave the track
- 📊 **HUD Display** - Real-time speed, lap count, and timer

## How to Play

1. Open `index.html` in your mobile browser
2. **Steer**: Drag left/right on the lower 2/3 of the screen
3. **Accelerate**: Tap the upper 1/3 of the screen
4. **Objective**: Complete as many laps as possible!

## Controls

| Action | Control |
|--------|----------|
| Steer Left | Drag Left |
| Steer Right | Drag Right |
| Accelerate | Tap/Touch Upper Area |
| Restart | Click Restart Button |

## Game Mechanics

- **Speed**: Increases with acceleration, decreases with friction
- **Track Boundaries**: Red circles mark the racing line
- **Lap Counter**: Increments when you cross the finish line (white dashed line)
- **Collision**: If you go off-track, you bounce back

## Customization

You can modify these values in `game.js`:

```javascript
car.maxSpeed = 500;        // Maximum speed
car.acceleration = 300;    // Acceleration rate
car.friction = 0.96;       // Friction coefficient
car.turnSpeed = 0.08;      // Steering sensitivity
```

## Deployment

To play online via GitHub Pages:

1. Go to repository Settings
2. Enable GitHub Pages (main branch)
3. Access your game at `https://kazukiminemura.github.io/racing-game/`

## Technologies Used

- HTML5 Canvas
- CSS3
- Vanilla JavaScript
- Touch Events API

## License

MIT License
