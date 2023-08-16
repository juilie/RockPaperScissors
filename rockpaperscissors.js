// Create Canvas
const canvasWidth = window.innerHeight / 1.5
const canvasHeight = window.innerHeight / 1.5
const canvas = document.createElement('canvas');
canvas.width = canvasWidth
canvas.height = canvasHeight
document.body.appendChild(canvas);

// Create start button
let button = document.createElement('button')
button.innerText = "New Game"
button.onclick = () => {
    init()
};
document.body.appendChild(button)

// Game Settings
const playerAmount = 18
const movementSpeed = 1
const playerSize = 50
let players = []

// initialize 2D canvas
let sketch = canvas.getContext("2d");

// create sprites
let rockImg = new Image(playerSize, playerSize)
rockImg.src = 'https://raw.githubusercontent.com/juilie/RockPaperScissors/421305cbbcd7a8c0ffc938a3062da43460ae046a/assets/rock.png'

let paperImg = new Image(playerSize, playerSize)
paperImg.src = 'https://raw.githubusercontent.com/juilie/RockPaperScissors/421305cbbcd7a8c0ffc938a3062da43460ae046a/assets/paper.png'

let scissorsImg = new Image(playerSize, playerSize)
scissorsImg.src = 'https://raw.githubusercontent.com/juilie/RockPaperScissors/421305cbbcd7a8c0ffc938a3062da43460ae046a/assets/scissors.png'

// Describe qualities of each player type
const playerTypes = {
    "Rock": {
        name: "Rock",
        target: "Scissors",
        enemy: "Paper",
        sound: "https://raw.githubusercontent.com/juilie/RockPaperScissors/421305cbbcd7a8c0ffc938a3062da43460ae046a/assets/paper.wav",
        image: rockImg
    },
    "Paper": {
        name: "Paper",
        target: "Rock",
        enemy: "Scissors",
        sound: "https://raw.githubusercontent.com/juilie/RockPaperScissors/421305cbbcd7a8c0ffc938a3062da43460ae046a/assets/scissors.wav",
        image: paperImg
    },
    "Scissors": {
        name: "Scissors",
        target: "Paper",
        enemy: "Rock",
        sound: "https://raw.githubusercontent.com/juilie/RockPaperScissors/421305cbbcd7a8c0ffc938a3062da43460ae046a/assets/rock.wav",
        image: scissorsImg
    }
}

function init() {
    // reset player array
    players = []

    // Create an equal amount of rocks, papers, and scissors
    for (let i = 0; i < playerAmount; i++) {
        players[i] = new Player(Object.values(playerTypes)[i % 3])
    }
}

function animationLoop() {
    // Draw background
    sketch.fillRect(0, 0, canvasWidth, canvasHeight)

    // Move players
    players.forEach(player => {
        player.update(players)
    });

    // Call animation loop for next frame
    window.requestAnimationFrame(animationLoop)
}

// initialize animation loop
animationLoop()

class Player {
    constructor(playerType) {
        this.playerType = playerType
        this.x = Math.floor(Math.random() * (canvasWidth - playerSize))
        this.y = Math.floor(Math.random() * (canvasHeight - playerSize))
    }

    update() {
        let minDistance = Number.MAX_VALUE;
        let closestTarget;

        players.forEach(otherPlayer => {

            // Detect if hit by enemy
            if (this.detectCollision(otherPlayer) && otherPlayer.playerType.name == this.playerType
                .enemy) {
                new Audio(this.playerType.sound).play()

                // Defeat = becoming enemy type
                this.playerType = otherPlayer.playerType
            }

            let distance = Math.sqrt((this.x - otherPlayer.x) ** 2 + (this.y - otherPlayer.y) ** 2)

            // Replace closest target if distance is smallest
            if (distance < minDistance && otherPlayer.playerType.name == this.playerType.target) {
                minDistance = distance
                closestTarget = otherPlayer
            }
        });

        let X_IN_BOUNDS = this.x > 0 && this.x < canvasWidth - playerSize;
        let Y_IN_BOUNDS = this.y > 0 && this.y < canvasHeight - playerSize;

        // Move towards closest target
        if (closestTarget && X_IN_BOUNDS && Y_IN_BOUNDS) {

            this.x < closestTarget.x ? this.x += movementSpeed : this.x -= movementSpeed
            this.y < closestTarget.y ? this.y += movementSpeed : this.y -= movementSpeed

        } else {
            // If there are not targets
            // Shake in fear or celebrate victory
            this.x += Math.random() - .5
            this.y += Math.random() - .5
        }

        sketch.drawImage(this.playerType.image, this.x, this.y)
    }

    detectCollision(target) {

        // To check for collision between 2 rectangles
        // Ensure there is no gap between any of the 4 sides
        if (this.x + playerSize >= target.x && // r1 right edge past r2 left
            this.x <= target.x + playerSize && // r1 left edge past r2 right
            this.y + playerSize >= target.y && // r1 top edge past r2 bottom
            this.y <= target.y + playerSize) { // r1 bottom edge past r2 top
            return true;
        }
        return false;
    }
}