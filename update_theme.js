const fs = require('fs');
const path = require('path');

const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

const tailwindConfig = `
    <script>
        tailwind.config = {
            theme: {
                extend: {
                    colors: {
                        blue: {
                            50: '#f0f9ff',
                            100: '#e0e7ff',
                            200: '#ffedd5', // Orange light for shadows
                            500: '#f97316', // Orange
                            600: '#1e3a8a', // Dark Blue
                            700: '#ea580c', // Dark Orange (Hover)
                            800: '#172554',
                            900: '#0f172a',
                        }
                    }
                }
            }
        }
    </script>`;

files.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    
    // Check if config already exists
    if (!content.includes('tailwind.config =')) {
        content = content.replace(
            '<script src="https://cdn.tailwindcss.com"></script>',
            '<script src="https://cdn.tailwindcss.com"></script>\n' + tailwindConfig
        );
        fs.writeFileSync(file, content, 'utf8');
        console.log(`Updated ${file}`);
    }
});

// Update style.css
let styleContent = fs.readFileSync('style.css', 'utf8');
styleContent = styleContent.replace('--primary: #2563EB;', '--primary: #1e3a8a; /* Dark Blue */');
styleContent = styleContent.replace('--primary-light: #3B82F6;', '--primary-light: #f97316; /* Orange */');
fs.writeFileSync('style.css', styleContent, 'utf8');
console.log('Updated style.css');
