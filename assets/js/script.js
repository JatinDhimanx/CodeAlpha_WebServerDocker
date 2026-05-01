document.addEventListener('DOMContentLoaded', () => {
    // 1. Mouse Glow Effect
    const cursorGlow = document.getElementById('cursor-glow');
    
    document.addEventListener('mousemove', (e) => {
        if (window.innerWidth > 768) {
            cursorGlow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
        }
    });

    // 2. Terminal Typewriter Effect
    const textElement = document.getElementById('typewriter');
    const commands = [
        "docker build -t nexus-web .",
        "docker run -d -p 80:80 nexus-web",
        "Server is running on port 80..."
    ];
    
    let currentLine = 0;
    let currentChar = 0;

    function typeWriter() {
        if (currentLine < commands.length) {
            if (currentChar < commands[currentLine].length) {
                textElement.innerHTML += commands[currentLine].charAt(currentChar);
                currentChar++;
                setTimeout(typeWriter, Math.random() * 50 + 50); // 50-100ms per char
            } else {
                // Finished a line
                if (currentLine < commands.length - 1) {
                    textElement.innerHTML += "<br><span class='prompt'>$</span> ";
                }
                currentLine++;
                currentChar = 0;
                setTimeout(typeWriter, 800); // Wait before next line
            }
        } else {
            // Remove blinking cursor when done, or leave it. We will leave it.
            const cursor = document.querySelector('.cursor');
            cursor.style.animation = 'blink 1s step-end infinite';
        }
    }

    setTimeout(typeWriter, 1000);
});
