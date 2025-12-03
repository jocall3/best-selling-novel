# Page 95: The Shifting Walls of Privacy

## Agent 81's Personal Space Bubble Demonstration

This page visualizes the dynamic application of Agent 81's "Personal Space Bubble" algorithm within a simulated open-plan office environment. As avatars move, the algorithm calculates and renders ephemeral, translucent digital barriers that define each user's immediate, private working zone.

---

### Simulation Parameters

| Parameter | Value | Description |
| :--- | :--- | :--- |
| **Office Size** | 50x30 Units | The dimensions of the open-plan floor. |
| **Avatar Count** | 12 | The number of active agents moving through the space. |
| **Bubble Radius** | 3.0 Units | The standard distance maintained by the personal bubble. |
| **Wall Opacity** | 0.15 | High transparency to maintain visual awareness while enforcing boundaries. |
| **Update Frequency** | 100ms | How often the bubble geometry is recalculated. |

---

### Visualization Canvas

The following interactive visualization demonstrates the effect. Click the "Start Simulation" button to observe the dynamic boundary generation.

<div id="office-simulation" style="width: 100%; height: 400px; border: 1px solid #ccc; position: relative; background-color: #f9f9f9; overflow: hidden;">
    <canvas id="officeCanvas" style="width: 100%; height: 100%;"></canvas>
    <div id="controls" style="position: absolute; top: 10px; right: 10px; z-index: 10;">
        <button id="startButton" style="padding: 8px 15px; cursor: pointer;">Start Simulation</button>
        <button id="stopButton" style="padding: 8px 15px; cursor: pointer; display: none;">Stop Simulation</button>
    </div>
</div>

---

### Algorithm Explanation (Conceptual)

Agent 81's algorithm operates on a continuous proximity check:

1.  **Proximity Mapping:** For every Avatar $A_i$, the system identifies all other Avatars $A_j$ within $2 \times \text{Bubble Radius}$.
2.  **Boundary Generation:** For each pair $(A_i, A_j)$, a repulsive force field is calculated. This force field is translated into a series of line segments (the digital walls) that effectively push the boundary of $A_i$'s space away from $A_j$, and vice-versa.
3.  **Dynamic Mesh:** The resulting geometry for $A_i$ is the convex hull of all points defined by the repulsion vectors, creating a smooth, yet defined, polygonal boundary around the avatar.
4.  **Rendering:** These polygons are rendered as semi-transparent blue meshes, constantly redrawing to reflect the current positions, creating the "shifting maze."

---

<script>
document.addEventListener('DOMContentLoaded', () => {
    const canvas = document.getElementById('officeCanvas');
    const ctx = canvas.getContext('2d');
    const startButton = document.getElementById('startButton');
    const stopButton = document.getElementById('stopButton');

    const OFFICE_WIDTH = 500; // Scaled units for simulation logic
    const OFFICE_HEIGHT = 300;
    const BUBBLE_RADIUS = 30; // Scaled radius (3.0 units * 10)
    const AVATAR_COUNT = 12;
    const WALL_OPACITY = 0.15;
    const UPDATE_INTERVAL = 100; // ms

    let avatars = [];
    let simulationInterval = null;
    let isRunning = false;

    // --- Utility Functions ---

    function scaleX(x) {
        return (x / OFFICE_WIDTH) * canvas.clientWidth;
    }

    function scaleY(y) {
        return (y / OFFICE_HEIGHT) * canvas.clientHeight;
    }

    function distanceSq(p1, p2) {
        return (p1.x - p2.x) ** 2 + (p1.y - p2.y) ** 2;
    }

    // --- Avatar Class ---
    class Avatar {
        constructor(id) {
            this.id = id;
            this.x = Math.random() * (OFFICE_WIDTH - 20) + 10;
            this.y = Math.random() * (OFFICE_HEIGHT - 20) + 10;
            this.vx = (Math.random() - 0.5) * 1.5;
            this.vy = (Math.random() - 0.5) * 1.5;
            this.radius = 5;
            this.color = `hsl(${id * (360 / AVATAR_COUNT)}, 70%, 50%)`;
            this.bubblePoints = [];
        }

        move() {
            this.x += this.vx;
            this.y += this.vy;

            // Boundary collision (simple wall bounce)
            if (this.x < this.radius || this.x > OFFICE_WIDTH - this.radius) {
                this.vx *= -1;
                this.x = Math.max(this.radius, Math.min(OFFICE_WIDTH - this.radius, this.x));
            }
            if (this.y < this.radius || this.y > OFFICE_HEIGHT - this.radius) {
                this.vy *= -1;
                this.y = Math.max(this.radius, Math.min(OFFICE_HEIGHT - this.radius, this.y));
            }
        }
    }

    // --- Core Algorithm: Bubble Generation ---

    function calculatePersonalBubbles() {
        avatars.forEach(a => {
            let repulsionPoints = [];
            const R_SQ = BUBBLE_RADIUS * BUBBLE_RADIUS;

            // 1. Gather repulsion vectors from neighbors
            avatars.forEach(b => {
                if (a.id !== b.id) {
                    const distSq = distanceSq(a, b);
                    if (distSq < 4 * R_SQ) { // Check within 2x radius
                        const dist = Math.sqrt(distSq);
                        const overlap = BUBBLE_RADIUS - dist;

                        if (overlap > 0) {
                            // Calculate direction vector from b to a
                            const dx = a.x - b.x;
                            const dy = a.y - b.y;
                            const norm = Math.sqrt(dx * dx + dy * dy) || 1;

                            // Push point outwards along the normalized vector
                            // The further the overlap, the further the push point
                            const pushFactor = overlap * 1.5; // Exaggerate the push slightly
                            
                            const pushX = a.x + (dx / norm) * (BUBBLE_RADIUS + pushFactor);
                            const pushY = a.y + (dy / norm) * (BUBBLE_RADIUS + pushFactor);
                            
                            repulsionPoints.push({ x: pushX, y: pushY });
                        }
                    }
                }
            });

            // 2. Define base points (the avatar's own bubble perimeter)
            // We use 16 points around the base radius to form a starting polygon
            const basePoints = [];
            for (let i = 0; i < 16; i++) {
                const angle = (i / 16) * Math.PI * 2;
                basePoints.push({
                    x: a.x + BUBBLE_RADIUS * Math.cos(angle),
                    y: a.y + BUBBLE_RADIUS * Math.sin(angle)
                });
            }

            let finalPoints = [...basePoints, ...repulsionPoints];

            // 3. Calculate Convex Hull (Simplified: just use the furthest points)
            // For a true visualization, a full convex hull algorithm (like Graham Scan) would be used.
            // Here, we simplify by taking the furthest point in each angular sector relative to the avatar center.
            
            const hullMap = new Map(); // Key: angle sector, Value: furthest point

            finalPoints.forEach(p => {
                const dx = p.x - a.x;
                const dy = p.y - a.y;
                let angle = Math.atan2(dy, dx);
                if (angle < 0) angle += 2 * Math.PI;

                // Quantize angle into sectors (e.g., 32 sectors)
                const sector = Math.floor(angle / (2 * Math.PI / 32));
                
                const distSq = dx * dx + dy * dy;

                if (!hullMap.has(sector) || distSq > hullMap.get(sector).distSq) {
                    hullMap.set(sector, { x: p.x, y: p.y, distSq: distSq });
                }
            });

            // Sort the resulting points by angle to form a coherent polygon
            a.bubblePoints = Array.from(hullMap.values())
                .sort((p1, p2) => {
                    const angle1 = Math.atan2(p1.y - a.y, p1.x - a.x);
                    const angle2 = Math.atan2(p2.y - a.y, p2.x - a.x);
                    return angle1 - angle2;
                });
        });
    }

    // --- Rendering ---

    function draw() {
        // Resize canvas to fit container
        const rect = canvas.parentElement.getBoundingClientRect();
        canvas.width = rect.width;
        canvas.height = rect.height;

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // 1. Draw Office Background (Conceptual boundaries)
        ctx.strokeStyle = '#ddd';
        ctx.lineWidth = 1;
        ctx.strokeRect(scaleX(10), scaleY(10), scaleX(OFFICE_WIDTH - 20), scaleY(OFFICE_HEIGHT - 20));

        // 2. Draw Bubbles (The dynamic walls)
        avatars.forEach(a => {
            if (a.bubblePoints.length > 2) {
                ctx.beginPath();
                ctx.moveTo(scaleX(a.bubblePoints[0].x), scaleY(a.bubblePoints[0].y));

                for (let i = 1; i < a.bubblePoints.length; i++) {
                    ctx.lineTo(scaleX(a.bubblePoints[i].x), scaleY(a.bubblePoints[i].y));
                }
                ctx.closePath();

                ctx.fillStyle = `rgba(0, 100, 255, ${WALL_OPACITY})`;
                ctx.fill();
                
                // Optional: Draw a faint outline for clarity
                ctx.strokeStyle = `rgba(0, 100, 255, 0.5)`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });

        // 3. Draw Avatars and Center Points
        avatars.forEach(a => {
            // Draw Avatar Body
            ctx.beginPath();
            ctx.arc(scaleX(a.x), scaleY(a.y), scaleX(a.radius), 0, Math.PI * 2);
            ctx.fillStyle = a.color;
            ctx.fill();
            
            // Draw ID label
            ctx.fillStyle = '#000';
            ctx.font = `${scaleX(3)}px Arial`;
            ctx.textAlign = 'center';
            ctx.fillText(a.id, scaleX(a.x), scaleY(a.y) + scaleX(1.5));
        });
    }

    // --- Simulation Loop ---

    function updateSimulation() {
        avatars.forEach(a => a.move());
        calculatePersonalBubbles();
        draw();
    }

    function startSimulation() {
        if (isRunning) return;
        isRunning = true;
        
        // Initialize avatars if not already done
        if (avatars.length === 0) {
            for (let i = 1; i <= AVATAR_COUNT; i++) {
                avatars.push(new Avatar(i));
            }
        }

        startButton.style.display = 'none';
        stopButton.style.display = 'inline-block';
        
        // Run the first draw immediately
        updateSimulation(); 
        
        simulationInterval = setInterval(updateSimulation, UPDATE_INTERVAL);
    }

    function stopSimulation() {
        if (simulationInterval) {
            clearInterval(simulationInterval);
            simulationInterval = null;
        }
        isRunning = false;
        startButton.style.display = 'inline-block';
        stopButton.style.display = 'none';
    }

    // --- Event Listeners ---
    startButton.addEventListener('click', startSimulation);
    stopButton.addEventListener('click', stopSimulation);

    // Handle window resizing to keep canvas responsive
    window.addEventListener('resize', () => {
        if (!isRunning) {
            // Redraw static state if stopped
            draw(); 
        }
    });

    // Initial setup call (draws empty office)
    draw();
});
</script>