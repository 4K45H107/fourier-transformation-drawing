let TIME = 0;
let WAVE = [];

function setup() {
    createCanvas(800, 600);
    background(220);
}

function draw() {
    // Draw the background
    background(0);
    
    // Translate to the center of the canvas
    translate(170,300);
    
    let X = 0;
    let Y = 0;

    // For square wave -> 4 * RADIUS * sin(n*TIME) / (n*PI) | n = 1, 3, 5, 7, 9, ...
    for (let i = 0; i < 10; i++) {

        let N = 2*i + 1;
        let RADIUS = 4 * 70 / (N*PI);

        let prevX = X;
        let prevY = Y;
        
        X += RADIUS * cos(N*TIME);
        Y += RADIUS * sin(N*TIME);


        // Draw the circle
        stroke(255, 100);
        noFill();
        ellipse(prevX,prevY,RADIUS*2);

        // Draw the line from center of the circle to the point
        stroke(255);
        line(prevX,prevY,X,Y);

        // // Draw the point on the circumference of the circle as a small circle
        // stroke(255);
        // fill(255);
        // ellipse(X,Y,1);

        // Update the previous X and Y values
        prevX = X;
        prevY = Y;
    }

    // Add the Y value to draw the wave
    WAVE.unshift(Y);

    // Draw the wave
    translate(200,0);

    // Draw the line from circle point to wave point
    stroke(255);
    line(X-200,Y,0,WAVE[0]);

    // Draw the wave
    beginShape();
    noFill();
    // Loop through the WAVE array to draw the history of the wave
    for(let i = 0; i < WAVE.length; i++) {
        vertex(i,WAVE[i]);
    }
    endShape();

    TIME += 0.05;

    if(WAVE.length > 370) {
        WAVE.pop();
    }
}